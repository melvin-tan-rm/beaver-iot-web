import React, { useState } from 'react'
import { Form, FormGroup, Label, Input, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Plus, Edit, Trash2, User } from 'react-feather'

const UserSettings = ({ settings, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'auditor',
    title: '',
    organization: '',
    peMechRegNumber: '',
    energyAuditorRegNumber: '',
    phone: ''
  })

  const handleChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  const handleUserFormChange = (field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }))
  }

  const openAddUserModal = () => {
    setEditingUser(null)
    setUserForm({
      name: '',
      email: '',
      role: 'auditor',
      title: '',
      organization: '',
      peMechRegNumber: '',
      energyAuditorRegNumber: '',
      phone: ''
    })
    setModalOpen(true)
  }

  const openEditUserModal = (user) => {
    setEditingUser(user)
    setUserForm(user)
    setModalOpen(true)
  }

  const handleSaveUser = () => {
    const users = settings.auditors || []
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.email === editingUser.email ? userForm : user
      )
      onUpdate({ auditors: updatedUsers })
    } else {
      // Add new user
      onUpdate({ auditors: [...users, { ...userForm, id: Date.now() }] })
    }
    setModalOpen(false)
  }

  const handleDeleteUser = (userToDelete) => {
    if (window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      const updatedUsers = (settings.auditors || []).filter(user => user.email !== userToDelete.email)
      onUpdate({ auditors: updatedUsers })
    }
  }

  const UserCard = ({ user, onEdit, onDelete }) => (
    <div className="user-item">
      <div className="user-header">
        <span className="user-name">{user.name}</span>
        <span className="user-role">{user.role}</span>
      </div>
      <div className="user-details">
        <div className="detail-item"><strong>Email:</strong> {user.email}</div>
        <div className="detail-item"><strong>Title:</strong> {user.title}</div>
        <div className="detail-item"><strong>Organization:</strong> {user.organization}</div>
        {user.peMechRegNumber && (
          <div className="detail-item"><strong>PE (Mech) Reg:</strong> {user.peMechRegNumber}</div>
        )}
        {user.energyAuditorRegNumber && (
          <div className="detail-item"><strong>Energy Auditor Reg:</strong> {user.energyAuditorRegNumber}</div>
        )}
      </div>
      <div className="mt-2">
        <Button size="sm" color="primary" outline className="me-2" onClick={() => onEdit(user)}>
          <Edit size={14} /> Edit
        </Button>
        <Button size="sm" color="danger" outline onClick={() => onDelete(user)}>
          <Trash2 size={14} /> Delete
        </Button>
      </div>
    </div>
  )

  return (
    <div className="setting-section">
      <h5 className="section-title">User Management</h5>
      
      <Form>
        <h6 className="section-title">Permission Settings</h6>
        
        <Row>
          <Col md={6}>
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="enableUserPermissions"
                checked={settings.enableUserPermissions !== false}
                onChange={(e) => handleChange('enableUserPermissions', e.target.checked)}
              />
              <Label check for="enableUserPermissions">
                Enable User Permission Management
              </Label>
              <div className="form-text">Control access to different report sections</div>
            </FormGroup>
          </Col>
          
          <Col md={6}>
            <FormGroup check className="mb-3">
              <Input
                type="checkbox"
                id="requireApproval"
                checked={settings.requireApproval !== false}
                onChange={(e) => handleChange('requireApproval', e.target.checked)}
              />
              <Label check for="requireApproval">
                Require Report Approval
              </Label>
              <div className="form-text">Reports must be approved before finalization</div>
            </FormGroup>
          </Col>
        </Row>

        <FormGroup check className="mb-4">
          <Input
            type="checkbox"
            id="enableDigitalSignatures"
            checked={settings.enableDigitalSignatures || false}
            onChange={(e) => handleChange('enableDigitalSignatures', e.target.checked)}
          />
          <Label check for="enableDigitalSignatures">
            Enable Digital Signatures
          </Label>
          <div className="form-text">Allow digital signing of reports</div>
        </FormGroup>

        <h6 className="section-title">Auditors & Team Members</h6>
        
        <div className="user-list">
          {(settings.auditors || []).map((user, index) => (
            <UserCard 
              key={index} 
              user={user} 
              onEdit={openEditUserModal}
              onDelete={handleDeleteUser}
            />
          ))}
          
          <Button 
            className="add-user-btn"
            onClick={openAddUserModal}
          >
            <Plus size={20} className="me-2" />
            Add New Team Member
          </Button>
        </div>

        <h6 className="section-title">Default Role Assignments</h6>
        
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="defaultAuditorRole" className="form-label">Default Auditor Role</Label>
              <Input
                type="select"
                id="defaultAuditorRole"
                value={settings.defaultAuditorRole || 'energy-auditor'}
                onChange={(e) => handleChange('defaultAuditorRole', e.target.value)}
              >
                <option value="energy-auditor">Energy Auditor</option>
                <option value="pe-mechanical">PE (Mechanical)</option>
                <option value="consultant">Consultant</option>
                <option value="facility-manager">Facility Manager</option>
              </Input>
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="defaultReviewerRole" className="form-label">Default Reviewer Role</Label>
              <Input
                type="select"
                id="defaultReviewerRole"
                value={settings.defaultReviewerRole || 'senior-engineer'}
                onChange={(e) => handleChange('defaultReviewerRole', e.target.value)}
              >
                <option value="senior-engineer">Senior Engineer</option>
                <option value="project-manager">Project Manager</option>
                <option value="technical-director">Technical Director</option>
                <option value="quality-assurance">Quality Assurance</option>
              </Input>
            </FormGroup>
          </Col>
          
          <Col md={4}>
            <FormGroup>
              <Label for="defaultApproverRole" className="form-label">Default Approver Role</Label>
              <Input
                type="select"
                id="defaultApproverRole"
                value={settings.defaultApproverRole || 'director'}
                onChange={(e) => handleChange('defaultApproverRole', e.target.value)}
              >
                <option value="director">Director</option>
                <option value="principal-engineer">Principal Engineer</option>
                <option value="department-head">Department Head</option>
                <option value="authorized-signatory">Authorized Signatory</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </Form>

      {/* User Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          {editingUser ? 'Edit Team Member' : 'Add New Team Member'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userName" className="form-label">Full Name *</Label>
                  <Input
                    type="text"
                    id="userName"
                    value={userForm.name}
                    onChange={(e) => handleUserFormChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <Label for="userEmail" className="form-label">Email Address *</Label>
                  <Input
                    type="email"
                    id="userEmail"
                    value={userForm.email}
                    onChange={(e) => handleUserFormChange('email', e.target.value)}
                    placeholder="user@company.com"
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userRole" className="form-label">Role *</Label>
                  <Input
                    type="select"
                    id="userRole"
                    value={userForm.role}
                    onChange={(e) => handleUserFormChange('role', e.target.value)}
                  >
                    <option value="auditor">Energy Auditor</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="approver">Approver</option>
                    <option value="consultant">Consultant</option>
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <Label for="userTitle" className="form-label">Job Title</Label>
                  <Input
                    type="text"
                    id="userTitle"
                    value={userForm.title}
                    onChange={(e) => handleUserFormChange('title', e.target.value)}
                    placeholder="e.g., Senior Mechanical Engineer"
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for="userOrganization" className="form-label">Organization</Label>
              <Input
                type="text"
                id="userOrganization"
                value={userForm.organization}
                onChange={(e) => handleUserFormChange('organization', e.target.value)}
                placeholder="Company/Organization name"
              />
            </FormGroup>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="userPeMech" className="form-label">PE (Mechanical) Registration</Label>
                  <Input
                    type="text"
                    id="userPeMech"
                    value={userForm.peMechRegNumber}
                    onChange={(e) => handleUserFormChange('peMechRegNumber', e.target.value)}
                    placeholder="PE Registration Number"
                  />
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <Label for="userEnergyAuditor" className="form-label">Energy Auditor Registration</Label>
                  <Input
                    type="text"
                    id="userEnergyAuditor"
                    value={userForm.energyAuditorRegNumber}
                    onChange={(e) => handleUserFormChange('energyAuditorRegNumber', e.target.value)}
                    placeholder="EA Registration Number"
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for="userPhone" className="form-label">Phone Number</Label>
              <Input
                type="tel"
                id="userPhone"
                value={userForm.phone}
                onChange={(e) => handleUserFormChange('phone', e.target.value)}
                placeholder="+65 1234 5678"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={handleSaveUser}
            disabled={!userForm.name || !userForm.email}
          >
            {editingUser ? 'Update' : 'Add'} User
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default UserSettings