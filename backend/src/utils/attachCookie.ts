import { Response } from "express";

type CookiesType = {
  res: Response;
  token: string;
}

const attachCookie = ({ res, token }: CookiesType) => {
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("auth_token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
};

export default attachCookie;