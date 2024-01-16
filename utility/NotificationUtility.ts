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
  const authToken = "5a8f3a8ca9e86f16999ffe6c913c7471";
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+12549463309",
    to: `+91${toPhoneNumber}`,
  });

  return response;
};

//Payment notificaiton or Email
