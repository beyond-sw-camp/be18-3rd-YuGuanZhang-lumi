import api from './axios';

export async function createSubmission(channelId, assignmentId, payload) {
  const { data } = await api.post(
    `/channels/${channelId}/assignments/${assignmentId}/submissions`,
    payload,
  );
  return Array.isArray(data.data) ? data.data[0] : data.data;
}

export async function getSubmission(channelId, assignmentId) {
  const { data } = await api.get(`/channels/${channelId}/assignments/${assignmentId}/submissions`);
  return Array.isArray(data.data) ? data.data[0] : data.data;
}

export async function updateSubmission(channelId, assignmentId, submissionId, payload) {
  const { data } = await api.put(
    `/channels/${channelId}/assignments/${assignmentId}/submissions/${submissionId}`,
    payload,
  );
  return Array.isArray(data.data) ? data.data[0] : data.data;
}

export async function deleteSubmission(channelId, assignmentId, submissionId) {
  const { data } = await api.delete(
    `/channels/${channelId}/assignments/${assignmentId}/submissions/${submissionId}`,
  );
  return data.data;
}
