Commands to run to get this project running:
1. git clone https://github.com/Kapil-chn7/UserAuthentication/tree/GIT_001
2. git checkout GIT_001
3. npm install
4. Go to swagger and open Lensauth.yaml
5. Create request accordingly as mentioned in swagger doc
6. Got to postman, http://localhost:8000/ {paths mentioned in swagger}
   
ENV variables need.
create a .env file and provide your variables

DEV_PORT=1000
JWT_ALGORITHM='Any Algorithm'
JWT_PRIVATE_KEY=Private_key
DB_URL="Your DB URL"
HASH_SALT_ROUND=Number like 10
