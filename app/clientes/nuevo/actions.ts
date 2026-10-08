"use server";

import { getPool } from "@/lib/db/client";
import { DemoReadOnlyError } from "@/lib/data/repository";

export interface NuevoClienteResult {
  ok: boolean;
  error: string | null;
}

export async function registrarClienteAction(
  _prev: NuevoClienteResult,
  formData: FormData,
): Promise<NuevoClienteResult> {
  const name = String(formData.get("name") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const fechaNacimiento = String(formData.get("fecha_nacimiento") ?? "").trim();
  const profesion = String(formData.get("profesion") ?? "").trim();
  const estadoCivil = String(formData.get("estado_civil") ?? "").trim();
  const conyugeNombre = String(formData.get("conyuge_nombre") ?? "").trim();
  const conyugeDni = String(formData.get("conyuge_dni") ?? "").trim();
  const calle = String(formData.get("calle") ?? "").trim();
  const numero = String(formData.get("numero") ?? "").trim();
  const localidad = String(formData.get("localidad") ?? "").trim();
  const cp = String(formData.get("cp") ?? "").trim();

  if (!name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  const pool = getPool();
  if (!pool) {
    return { ok: false, error: new DemoReadOnlyError().message };
  }

  try {
    await pool.execute(
      `INSERT INTO clientes
        (name, dni, phone, email, fecha_nacimiento, profesion, estado_civil,
         conyuge_nombre, conyuge_dni, calle, numero, localidad, cp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        dni || null,
        phone || null,
        email || null,
        fechaNacimiento || null,
        profesion || null,
        estadoCivil || null,
        conyugeNombre || null,
        conyugeDni || null,
        calle || null,
        numero || null,
        localidad || null,
        cp || null,
      ],
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, error: null };
}
