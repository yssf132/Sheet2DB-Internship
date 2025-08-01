import mongoose from 'mongoose';

export const getAvailableCollections = async (): Promise<string[]> => {
  try {
    if (!mongoose.connection || !mongoose.connection.db) {
      console.warn('MongoDB connection not established');
      return [];
    }
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map(col => col.name).filter(name => !name.startsWith('system.'));
  } catch (error) {
    console.error('Error getting collections:', error);
    return [];
  }
};
