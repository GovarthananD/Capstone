import mongoose from 'mongoose';

const DB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB Connected');
    }catch(error){
        console.log('Error While Connecting DB:', error);
    }
}

export {DB};