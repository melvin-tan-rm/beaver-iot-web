import fse from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import { Command } from 'commander';
import { isFileExists } from '@milesight/scripts/src/utils';
import { pkgRoot, msgTemplate } from '../config';
import { logger, parseTemplate } from '../utils/index';
import {
    phraseClient,
    getProjectLocales,
    uploadLocale,
    createJob,
    addLocalesToJob,
    getJobList,
    downloadLocales,
} from '../services/phrase';
import { sendMessage } from '../services/wx-work';

const execJobCommand = async (name?: string, options?: ConfigType['phrase']) => {
    if (!phraseClient) return;

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'version',
            default: 'v1.0.0',
            message: 'Please enter the version of current iteration:',
        },
        {
            type: 'input',
            name: 'name',
            default(ans) {
                return name || `New i18n texts - ${ans.version}`;
            },
            message: 'Please enter the name of the new Phrase job:',
        },
        {
            type: 'input',
            name: 'target',
            default: options.jobTarget,
            message: 'Please enter the file path of new i18n texts:',
        },
        {
            type: 'input',
            name: 'branch',
            message: 'Whether to create a new branch (if not, please leave blank):',
        },
    ]);
    const targetPath = path.join(pkgRoot, answers.target);

    // console.log({ answers, targetPath });
    if (!isFileExists(targetPath)) {
        logger.error(
            `\n💥 The file path ${targetPath} does not exist, please check and try again.`,
        );
        return;
    }

    logger.info('\n✳️ Starting to create a new Phrase job...');

    // ---------- Get Project Locales ----------
    const locales = await getProjectLocales();
    const defaultLocale = locales.find(
        locale => locale.default || locale.code === options.defaultLocale,
    );

    if (!defaultLocale) {
        logger.error(
            `\n💥 The default locale ${options.defaultLocale} does not exist in the project, please check and try again.`,
        );
        return;
    }

    // ---------- Upload New Locale Texts ----------
    const contents = await fse.readFile(targetPath, 'utf-8');
    // const newTexts = JSON.parse(contents);
    const uploadResult = await uploadLocale({
        localeId: defaultLocale.id,
        contents,
        version: answers.version,
        fileName: `new-locales-${answers.version}.json`,
    });
    // console.log({ uploadResult });
    if (!uploadResult?.id) {
        logger.error(`\n💥 Failed to upload new i18n texts, please check and try again.`);
        return;
    }

    // ---------- Get Uploaded New Locale Keys ----------
    // const addedNewKeys = await getLocaleKeys({
    //     localeId: defaultLocale.id,
    //     tags: [answers.version],
    //     total: Object.keys(newTexts).length,
    // });

    // console.log(addedNewKeys);
    // ---------- Create New Phrase Job ----------
    const jobDetail = await createJob({
        name: answers.name,
        localeId: defaultLocale.id,
        branch: answers.branch,
        tags: [answers.version],
    });

    // console.log({ jobDetail });
    if (!jobDetail.id) {
        logger.error(`\n💥 Failed to create a new Phrase job, please check and try again.`);
        return;
    }

    try {
        await addLocalesToJob({
            jobId: jobDetail.id,
            localeIds: locales
                .filter(locale => locale.id !== defaultLocale.id)
                .map(locale => locale.id),
            branch: answers.branch,
        });
    } catch {
        logger.error(`\n💥 Failed to add locales to the Phrase job, please check and try again.`);
        return;
    }

    sendMessage({
        content: parseTemplate(msgTemplate, {
            projectName: jobDetail.project.name,
            deadline: new Date(jobDetail.due_date).toLocaleString(),
            jobName: jobDetail.name,
            jobLink:
                'https://app.phrase.com/accounts/milesight-25154ec8-a55f-438c-a39a-4e7155a5efd5/projects/beaver/jobs',
        }),
    });
    logger.success(
        `\n🎉 Successfully created a new Phrase job: <${jobDetail.name}>(ID: ${jobDetail.id})`,
    );
};

const execImportCommand = async (target?: string, options?: ConfigType['phrase']) => {
    if (!phraseClient) return;

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'branch',
            message: 'Whether to create a new branch (if not, please leave blank):',
        },
        {
            type: 'input',
            name: 'target',
            default: target || options.importTarget,
            validate: (input: string) => !!input,
            message: 'Please enter the directory path of newest locale texts:',
        },
        {
            type: 'confirm',
            name: 'confirm',
            default: false,
            async message(ans) {
                const jobList = await getJobList({ branch: ans.branch || undefined });
                const jobs = jobList.filter(job => job.state !== 'completed');
                const msg = !jobs.length
                    ? '🟡 No Phrase jobs are in progress, do you want to continue?'
                    : `🟡 There are ${jobs.length} Phrase jobs (${jobs.map(job => job.name).join(', ')}) in progress, do you want to continue?`;

                return msg;
            },
        },
    ]);

    if (!answers.confirm) return;
    logger.info('\n✳️ Starting to import the newest i18n texts...');

    // ---------- Check and create the target directory ----------
    const targetDir = path.join(pkgRoot, answers.target);
    if (!fse.existsSync(targetDir)) {
        fse.mkdirSync(targetDir, { recursive: true });
    }

    // ---------- Downloaded newest locale texts ----------
    const locales = await getProjectLocales();
    const localesTexts = await downloadLocales({
        branch: answers.branch,
        localeIds: locales.map(locale => locale.id),
    });

    if (!localesTexts?.length) {
        logger.error(`\n💥 Failed to download the newest i18n texts, please check and try again.`);
        return;
    }

    // ---------- Write the newest texts to files ----------
    locales.forEach((locale, index) => {
        const texts = localesTexts[index];
        const fileName = `${locale.code}.json`;

        fse.outputJSONSync(path.join(targetDir, fileName), texts, {
            encoding: 'utf-8',
            flag: 'w',
            spaces: 2,
        });
    });

    // console.log(localesTexts);
    logger.success(`\n🎉 Successfully imported the newest i18n texts to: ${targetDir}`);
};

export function phraseCommand(program: Command, cmdConfig: ConfigType['phrase']) {
    // console.log({ program, commandConfig });
    program
        .command('phrase')
        .option('--job [name]', 'Create a new job and name it.')
        .option(
            '--import [path]',
            'Import the newest i18n text into the specified directory path from Phrase.',
        )
        .description('Phrase platform related operations.')
        .action(options => {
            const { job, import: imports } = options;

            if (job) {
                execJobCommand(typeof job === 'string' ? job : undefined, cmdConfig);
                return;
            }

            if (imports) {
                execImportCommand(typeof imports === 'string' ? imports : undefined, cmdConfig);
            }
        });
}
