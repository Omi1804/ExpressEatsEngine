//Email

//notifications

//OTP
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  const accountSid = "ACcd9c9d0231f6f4ee097eec02f76ed85c";
  const authToken = "bfd13af2bc834d7543974df302e26f93";
  const client = require("twilio")(accountSid, authToken);

  const resposne = await client.message.create({
    body: `Your OTP is ${otp}`,
    from: "+917753951732",
    to: toPhoneNumber,
  });
};

//Payment notificaiton or Email
