// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function get_email(req, res) {
   let retval = {
      "response": 'this is the response',
      "response2": 'this is the second resonse'
   };

   res.status(200).json(retval);
}
