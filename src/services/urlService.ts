import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const shortenUrl = async (longUrl: string): Promise<string> => {
    const response = await axios.post(`${API_BASE_URL}/shorten`, { longUrl });
    return response.data.shortUrl;
};
