/**
 * LocalStorage Service to simulate backend database
 */
import { 
  type User, type Subject, type Activity, type Announcement, type Material,
  type InsertUser, type InsertSubject, type InsertActivity, type InsertAnnouncement, type InsertMaterial 
} from "./types";
import { nanoid } from 'nanoid';

const KEYS = {
  USERS: 'ols_users',
  SUBJECTS: 'ols_subjects',
  ACTIVITIES: 'ols_activities',
  ANNOUNCEMENTS: 'ols_announcements',
  MATERIALS: 'ols_materials',
  CURRENT_USER: 'ols_current_user'
};

// Initialize with Admin user if empty
const init = () => {
  if (typeof window === 'undefined') return;
  
  const users = localStorage.getItem(KEYS.USERS);
  if (!users) {
    const adminUser: User = {
      id: 1,
      role: 'admin',
      username: 'admin',
      password: 'admin123',
      name: 'Administrator',
      studentId: null,
      email: 'admin@school.edu',
      section: null
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify([adminUser]));
  }

  if (!localStorage.getItem(KEYS.SUBJECTS)) localStorage.setItem(KEYS.SUBJECTS, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.ACTIVITIES)) localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify([]));
  if (!localStorage.getItem(KEYS.MATERIALS)) localStorage.setItem(KEYS.MATERIALS, JSON.stringify([]));
};

init();

// Generic Helper
function getItems<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveItems<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

// --- USERS ---
export const storage = {
  users: {
    list: () => getItems<User>(KEYS.USERS),
    create: (user: InsertUser) => {
      const users = getItems<User>(KEYS.USERS);
      const newUser: User = { ...user, id: Date.now() }; // Simple ID gen
      users.push(newUser);
      saveItems(KEYS.USERS, users);
      return newUser;
    },
    update: (id: number, updates: Partial<User>) => {
      let users = getItems<User>(KEYS.USERS);
      users = users.map(u => u.id === id ? { ...u, ...updates } : u);
      saveItems(KEYS.USERS, users);
      return users.find(u => u.id === id);
    },
    delete: (id: number) => {
      let users = getItems<User>(KEYS.USERS);
      users = users.filter(u => u.id !== id);
      saveItems(KEYS.USERS, users);
    }
  },
  subjects: {
    list: () => getItems<Subject>(KEYS.SUBJECTS),
    create: (subject: InsertSubject) => {
      const items = getItems<Subject>(KEYS.SUBJECTS);
      const newItem = { ...subject, id: Date.now() };
      items.push(newItem);
      saveItems(KEYS.SUBJECTS, items);
      return newItem;
    },
    delete: (id: number) => {
      const items = getItems<Subject>(KEYS.SUBJECTS).filter(i => i.id !== id);
      saveItems(KEYS.SUBJECTS, items);
      
      // Cascade delete activities
      const activities = getItems<Activity>(KEYS.ACTIVITIES).filter(a => a.subjectId !== id);
      saveItems(KEYS.ACTIVITIES, activities);
    }
  },
  activities: {
    list: () => getItems<Activity>(KEYS.ACTIVITIES),
    create: (activity: InsertActivity) => {
      const items = getItems<Activity>(KEYS.ACTIVITIES);
      const newItem = { ...activity, id: Date.now() };
      items.push(newItem);
      saveItems(KEYS.ACTIVITIES, items);
      return newItem;
    },
    delete: (id: number) => {
      const items = getItems<Activity>(KEYS.ACTIVITIES).filter(i => i.id !== id);
      saveItems(KEYS.ACTIVITIES, items);
    }
  },
  announcements: {
    list: () => getItems<Announcement>(KEYS.ANNOUNCEMENTS),
    create: (announcement: InsertAnnouncement) => {
      const items = getItems<Announcement>(KEYS.ANNOUNCEMENTS);
      const newItem = { ...announcement, id: Date.now() };
      items.push(newItem);
      saveItems(KEYS.ANNOUNCEMENTS, items);
      return newItem;
    },
    delete: (id: number) => {
      const items = getItems<Announcement>(KEYS.ANNOUNCEMENTS).filter(i => i.id !== id);
      saveItems(KEYS.ANNOUNCEMENTS, items);
    }
  },
  materials: {
    list: () => getItems<Material>(KEYS.MATERIALS),
    create: (material: InsertMaterial) => {
      const items = getItems<Material>(KEYS.MATERIALS);
      const newItem = { ...material, id: Date.now() };
      items.push(newItem);
      saveItems(KEYS.MATERIALS, items);
      return newItem;
    },
    delete: (id: number) => {
      const items = getItems<Material>(KEYS.MATERIALS).filter(i => i.id !== id);
      saveItems(KEYS.MATERIALS, items);
    }
  },
  auth: {
    login: (username: string, password: string): User | null => {
      const users = getItems<User>(KEYS.USERS);
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
        return user;
      }
      return null;
    },
    logout: () => {
      localStorage.removeItem(KEYS.CURRENT_USER);
    },
    getCurrentUser: (): User | null => {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    }
  }
};
