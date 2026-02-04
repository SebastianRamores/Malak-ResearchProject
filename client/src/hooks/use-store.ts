import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/lib/storage";
import { InsertSubject, InsertActivity, InsertAnnouncement, InsertUser, InsertMaterial } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// === SUBJECTS ===
export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      // simulate network delay
      await new Promise(r => setTimeout(r, 500));
      return storage.subjects.list();
    }
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertSubject) => {
      await new Promise(r => setTimeout(r, 500));
      return storage.subjects.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: "Success", description: "Subject created successfully" });
    }
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(r => setTimeout(r, 300));
      return storage.subjects.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({ title: "Deleted", description: "Subject removed" });
    }
  });
}

// === ACTIVITIES ===
export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return storage.activities.list();
    }
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertActivity) => {
      await new Promise(r => setTimeout(r, 500));
      return storage.activities.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({ title: "Success", description: "Activity assigned" });
    }
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(r => setTimeout(r, 300));
      return storage.activities.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({ title: "Deleted", description: "Activity removed" });
    }
  });
}

// === ANNOUNCEMENTS ===
export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return storage.announcements.list();
    }
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertAnnouncement) => {
      await new Promise(r => setTimeout(r, 500));
      return storage.announcements.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({ title: "Posted", description: "Announcement is live" });
    }
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(r => setTimeout(r, 300));
      return storage.announcements.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({ title: "Deleted", description: "Announcement removed" });
    }
  });
}

// === USERS (STUDENTS) ===
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return storage.users.list().filter(u => u.role === 'student');
    }
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertUser) => {
      await new Promise(r => setTimeout(r, 500));
      // Force student role
      return storage.users.create({ ...data, role: 'student' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Enrolled", description: "Student account created" });
    }
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(r => setTimeout(r, 300));
      return storage.users.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Removed", description: "Student account deleted" });
    }
  });
}

// === MATERIALS ===
export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return storage.materials.list();
    }
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertMaterial) => {
      await new Promise(r => setTimeout(r, 500));
      return storage.materials.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Added", description: "Learning material uploaded" });
    }
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      await new Promise(r => setTimeout(r, 300));
      return storage.materials.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Removed", description: "Material deleted" });
    }
  });
}
