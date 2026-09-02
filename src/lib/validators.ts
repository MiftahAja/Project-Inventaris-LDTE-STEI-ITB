import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password harus diisi"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama harus minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password harus minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const barangSchema = z.object({
  namaBarang: z.string().min(1, "Nama barang harus diisi"),
});

export const unitBarangSchema = z.object({
  barangId: z.string().min(1, "Barang harus dipilih"),
  kodeBarang: z.string().min(1, "Kode barang harus diisi"),
  kondisiBarang: z.string().min(1, "Kondisi barang harus dipilih"),
  status: z.string().min(1, "Status harus dipilih"),
  ruangLabId: z.string().optional(),
  mejaId: z.string().optional(),
});

export const ruangLabSchema = z.object({
  namaRuang: z.string().min(1, "Nama ruang harus diisi"),
  deskripsi: z.string().optional(),
});

export const mejaSchema = z.object({
  ruangLabId: z.string().min(1, "Ruang lab harus dipilih"),
  meja: z.string().min(1, "Nomor meja harus diisi"),
});

export const petugasSchema = z.object({
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password harus minimal 6 karakter").optional(),
});

export const mutasiStokSchema = z.object({
  unitBarangId: z.string().min(1, "Unit barang harus dipilih"),
  tipe: z.enum(["MASUK", "KELUAR"], { message: "Tipe harus MASUK atau KELUAR" }),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  keterangan: z.string().optional(),
});

export const assignmentSchema = z.object({
  userId: z.string().min(1, "Petugas harus dipilih"),
  ruangLabId: z.string().min(1, "Ruang lab harus dipilih"),
});

export const customerServiceSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  email: z.string().email("Email tidak valid"),
  subjek: z.string().min(1, "Subjek harus diisi"),
  pesan: z.string().min(1, "Pesan harus diisi").max(5000, "Pesan maksimal 5000 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BarangInput = z.infer<typeof barangSchema>;
export type UnitBarangInput = z.infer<typeof unitBarangSchema>;
export type RuangLabInput = z.infer<typeof ruangLabSchema>;
export type MejaInput = z.infer<typeof mejaSchema>;
export type PetugasInput = z.infer<typeof petugasSchema>;
export type MutasiStokInput = z.infer<typeof mutasiStokSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type CustomerServiceInput = z.infer<typeof customerServiceSchema>;
