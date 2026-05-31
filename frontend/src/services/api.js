// src/services/api.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://seu-backend-url/api' });

export const generateLicensePDF = async (processId) => {
  try {
    const response = await api.get(`/licenses/${processId}/pdf`, {
      responseType: 'blob',
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  } catch (error) {
    console.error("Erro ao gerar documento oficial:", error);
  }
};