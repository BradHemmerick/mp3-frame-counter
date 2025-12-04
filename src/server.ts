import "dotenv/config";
import { buildServer } from "./app";


const PORT = process.env.PORT || 3000;
const app = buildServer();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
