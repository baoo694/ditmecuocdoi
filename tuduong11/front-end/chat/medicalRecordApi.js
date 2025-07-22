const API_BASE = 'http://localhost:3000/api/medical-records'

export async function getPatientRecords(patientId, token) {
  const res = await fetch(`${API_BASE}/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function createMedicalRecord(data, token) {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateMedicalRecord(recordId, data, token) {
  const res = await fetch(`${API_BASE}/${recordId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteMedicalRecord(recordId, token) {
  const res = await fetch(`${API_BASE}/${recordId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function getAllMedicalRecords(token) {
  const res = await fetch(`${API_BASE}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function getMedicalRecordStatistics(token) {
  const res = await fetch(`${API_BASE}/statistics/all`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
