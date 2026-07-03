import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- Upload PDF ----------------

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ---------------- Documents ----------------

export const getDocuments = async () => {
  const response = await api.get("/documents");
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

// ---------------- Conversations ----------------

export const getConversations = async () => {
  const response = await api.get("/conversations");
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/conversations/${conversationId}`);
  return response.data;
};

// ---------------- Chat ----------------

export const postChat = async (
  question,
  documentIds,
  conversationId
) => {
  const response = await api.post("/chat", {
    question,
    documentIds,
    conversationId,
  });

  return response.data;
};

export default api;