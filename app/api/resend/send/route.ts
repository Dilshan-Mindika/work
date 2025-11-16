import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const { resiver, bodyReact, bodyHTML, title } = await req.json();
  try {
  } catch (er) {
    console.error(er);
    return Response.json(
      {
        status: "SERVER_ERROR",
        message: "Internal Sever Error, Please Chekc Your Server Console!",
        code: "INTERNAL_SR_ERR",
      },
      {
        status: 500,
      }
    );
  }
};
