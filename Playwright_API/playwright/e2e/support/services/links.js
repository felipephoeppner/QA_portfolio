import { request } from "@playwright/test";
import { get } from "node:http";

export const linksService = (request) => {
  const createLink = async (link, token) => {
    return await request.post('/api/links', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: link,
    });
  };

  const getLinks = async (token) => {
    return await request.get('/api/links', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const createAndReturnLinkId = async (link, token) => {
    const response = await createLink(link, token);
    const body = await response.json();
    return body.data.id;
  };

  const removeLink = async (id,token) => {
    return await request.delete(`/api/links/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return {
    createLink,
    getLinks,
    createAndReturnLinkId,
    removeLink
  };
};
