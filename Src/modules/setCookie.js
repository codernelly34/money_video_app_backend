const setCookie = (res, refreshToken, accessToken) => {
   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: true,
      signed: true,
      domain: 'localhost',
   });

   res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: true,
      signed: true,
      domain: 'localhost',
   });

   return true;
};

module.exports = setCookie;
