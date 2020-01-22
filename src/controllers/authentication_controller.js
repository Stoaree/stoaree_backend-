let jwt = require( 'jsonwebtoken' );
require("dotenv").config();

let checkToken = (req, res, next) =>
{
  // Express headers are auto converted to lowercase
  let token = req.headers['x-access-token'] ||
              req.headers['authorization'] || "";

  // An empty string allows the token to be treated as a string but will return false
  if( token.startsWith( 'Bearer ' ) )
  {
    // Remove Bearer from string
    token = token.slice( 7, token.length );
  }

  if( token )
  {
    // Pass in the token and the secret key into verify()
    jwt.verify( token, config.secret, (err, decoded) =>
    {
      if( err )
      {
        return res.json(
        {
          success: false,
          message: 'Token is not valid'
        } );
      }
      else
      {
        req.decoded = decoded;
        next();
      }
    } );
  }
  else
  {
    return res.json(
    {
      success: false,
      message: 'Auth token is not supplied'
    } );
  }
};

module.exports =
{
  checkToken: checkToken
}

function login(req, res)
{
    let { username, password } = req.body;

    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if( username && password )
    {
      if( username === mockedUsername && password === mockedPassword )
      {
        let token = jwt.sign( {username: username},
                    config.secret,
                    { expiresIn: '24h' } );

        // Return the JWT token for the future API calls
        res.json(
        {
          success: true,
          message: 'Authentication successful!',
          token: token
        } );
      }
      else
      {
        res.sendStatus(403).json(
        {
          success: false,
          message: 'Incorrect username or password'
        } );
      }
    }
    else
    {
      res.sendStatus(400).json(
      {
        success: false,
        message: 'Authentication failed! Please check the request'
      } );
    }
}
