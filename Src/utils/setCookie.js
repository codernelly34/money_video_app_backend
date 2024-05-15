const secure = process.env.NODE_ENV !== 'production' ? false : true;

const setCookie = (res, refreshToken, accessToken) => {
   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure,
      signed: true,
      domain: process.env.DOMAIN,
   });

   res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 1000,
      sameSite: 'lax',
      secure,
      signed: true,
      domain: process.env.DOMAIN,
   });

   return true;
};

const clearCookie = {
   refresh: (res) => {
      res.clearCookie('refreshToken', {
         httpOnly: true,
         sameSite: 'lax',
         secure,
         signed: true,
         domain: process.env.DOMAIN,
      });
   },

   access: (res) => {
      res.clearCookie('accessToken', {
         httpOnly: true,
         sameSite: 'lax',
         secure,
         signed: true,
         domain: process.env.DOMAIN,
      });
   },
};

module.exports = { setCookie, clearCookie };
