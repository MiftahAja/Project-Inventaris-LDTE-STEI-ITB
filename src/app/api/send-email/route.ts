import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nama, email, subjek, pesan } = await request.json();

    if (!nama || !email || !subjek || !pesan) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: "Hubungi Kami <inventaris-ldte@resend.dev>", 
      to: "miftahaufar@gmail.com", 
      subject: `[Kontak Baru] ${subjek}`,
      replyTo: email,
      html: `
        <h3>Pesan Baru dari Hubungi Kami</h3>
        <p><strong>Nama:</strong> ${nama}</p>
        <p><strong>Email Pengirim:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subjek}</p>
        <p><strong>Pesan:</strong></p>
        <p>${pesan}</p>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {

    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan internal";
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}
