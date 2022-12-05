// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Configuration, OpenAIApi } = require("openai");

const openai_configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openai_configuration);

const mailworks_prompt_text = "Create a three paragraph professional email with a salutation, with a conclusion, saying:";

function check_user_is_signed_in(user) {
   // todo. currently always signed in
   return true;
}

function check_user_is_rate_limited(user) {
   // todo. currently never rate-limited
   return false;
}


export default async function get_email(req, res) {
   let resobj = {};
   let rescode = 200;


   // Steps
   // 1. check user in request is signed in. bail if not.
   const user_is_signed_in = check_user_is_signed_in();
   if (!user_is_signed_in) {
      rescode = 401;
      resobj = {
         "error": {
            "message": "User is not signed in.",
            "code": rescode
         }
      };

      return res.status(rescode).json(resobj);
   }

   // 2. check signed-in user is not rate-limited from prior use. bail if not.
   const user_is_rate_limited = check_user_is_rate_limited();
   if (user_is_rate_limited) {
      rescode = 403;
      resobj = {
         "error": {
            "message": "User is rate-limited. Try again later.",
            "code": rescode
         }
      };

      return res.status(rescode).json(resobj);
   }

   // 3. make request to complete whatever was sent in request body JSON object parameter "prompt"
   //debug here, delete this stuff:
   if (!req.body || !req.body["prompt"]) {
      req["body"] = { "prompt": "nothing" };
   }
   //debug there, delete the stuff above^
   
   const completion = await openai.createCompletion({
      "prompt": mailworks_prompt_text + req.body["prompt"],
      "model": "text-davinci-002",
      "max_tokens": 1000,
      "temperature": 0.7
   });


   // 4. TODO: handle errors from openai
   // 5. TODO: record request for future rate-limiting

   // 6. Respond to the caller with the completion
   rescode = 200;
   resobj = {
      "email_text": completion.data.choices[0].text
   }
   res.status(rescode).json(resobj);
}
