import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
import * as addressService from "./addressService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const deleteMessage = async (request) => {
  const url = new URL(request.url);
  const part = url.pathname.split("/");
  const id = part[2]
  await addressService.deleteById(id);
  return redirectTo("/");
}

const saveMessage = async (request) => {
  const formData = await request.formData();
  const sender = formData.get("sender");
  const message = formData.get("message");
  await addressService.create(sender,message);
  return redirectTo("/");
}
const listAddresses = async () => {
  const data = {
    addresses: await addressService.findAll(),
  };
  return new Response(await renderFile("count.eta", data), responseDetails);
  
}
const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (request.method === "POST" && url.pathname.startsWith("/delete/")) {
    return await deleteMessage(request);
  }else if (request.method === "POST") {
    return await saveMessage(request);
  }else{
    return await listAddresses();
}};

serve(handleRequest, { port: 7777 });