import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRequire = createRequire(path.resolve(__dirname, '../backend/package.json'));

const mongoose = backendRequire('mongoose');
const dotenv = backendRequire('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathpilot';
const SEEDS_DIR = path.resolve(__dirname, '../data/seeds');

// Schemas for seeding
const skillSchema = new mongoose.Schema({}, { strict: false });
const depSchema = new mongoose.Schema({}, { strict: false });
const resourceSchema = new mongoose.Schema({}, { strict: false });
const projectSchema = new mongoose.Schema({}, { strict: false });
const workCategorySchema = new mongoose.Schema({}, { strict: false });

const Skill = mongoose.model('Skill', skillSchema, 'skills');
const SkillDependency = mongoose.model('SkillDependency', depSchema, 'skilldependencies');
const Resource = mongoose.model('Resource', resourceSchema, 'resources');
const Project = mongoose.model('Project', projectSchema, 'projects');
const WorkCategory = mongoose.model('WorkCategory', workCategorySchema, 'workcategories');

async function seed() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully for seeding.');
  } catch (err) {
    console.error('Failed to connect to MongoDB for seeding:', err.message);
    process.exit(1);
  }

  try {
    // 1. Skills
    const skills = JSON.parse(fs.readFileSync(path.join(SEEDS_DIR, 'skills.json'), 'utf-8'));
    for (const skill of skills) {
      await Skill.findOneAndUpdate({ slug: skill.slug }, skill, { upsert: true, new: true });
    }
    console.log(`✓ Seeded ${skills.length} skills.`);

    // 2. Dependencies
    const deps = JSON.parse(fs.readFileSync(path.join(SEEDS_DIR, 'skillDependencies.json'), 'utf-8'));
    for (const dep of deps) {
      await SkillDependency.findOneAndUpdate(
        { skillSlug: dep.skillSlug, prerequisiteSlug: dep.prerequisiteSlug },
        dep,
        { upsert: true, new: true }
      );
    }
    console.log(`✓ Seeded ${deps.length} skill dependencies.`);

    // 3. Resources
    const resources = JSON.parse(fs.readFileSync(path.join(SEEDS_DIR, 'resources.json'), 'utf-8'));
    for (const res of resources) {
      await Resource.findOneAndUpdate({ slug: res.slug }, res, { upsert: true, new: true });
    }
    console.log(`✓ Seeded ${resources.length} resources.`);

    // 4. Projects
    const projects = JSON.parse(fs.readFileSync(path.join(SEEDS_DIR, 'projects.json'), 'utf-8'));
    for (const proj of projects) {
      await Project.findOneAndUpdate({ slug: proj.slug }, proj, { upsert: true, new: true });
    }
    console.log(`✓ Seeded ${projects.length} project checkpoints.`);

    // 5. Work Categories
    const workCategories = JSON.parse(fs.readFileSync(path.join(SEEDS_DIR, 'workCategories.json'), 'utf-8'));
    for (const wc of workCategories) {
      await WorkCategory.findOneAndUpdate({ slug: wc.slug }, wc, { upsert: true, new: true });
    }
    console.log(`✓ Seeded ${workCategories.length} Tier-2 work categories.`);

    console.log('\n🎉 All database seeds populated successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}

seed();
