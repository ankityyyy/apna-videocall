let IS_PROD = true;

const server = IS_PROD
  ? "https://apna-videocall-backend.onrender.com/"
  : "http://localhost:3002";

export default server;
