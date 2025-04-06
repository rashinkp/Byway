import env from 'dotenv';
import app from './app';
import prisma from './core/database';


env.config();


const PORT = process.env.PORT || 5000 

app.listen(PORT, () => {
  console.log(`🔥Server is running on port ${PORT}`); 
})


process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected")
  process.exit(0);
})