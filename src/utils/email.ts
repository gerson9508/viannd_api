export const sendVerificationCode = async (email: string, code: string) => {
   console.log('📧 Intentando enviar a:', email);

   const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
         apikey: process.env.ELASTICEMAIL_API_KEY!,
         from: 'gersonsama95@gmail.com',
         fromName: 'Viannd',
         to: email,
         subject: 'Tu código de verificación - Viannd',
         bodyHtml: `
        <div style="font-family: system-ui, sans-serif; max-width: 420px; margin: auto; background-color: #f5f5f0; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #4CAF50; padding: 32px 24px; text-align: center;">
            <div style="font-size: 36px;">🥗</div>
            <h1 style="color: white; margin: 8px 0 0; font-size: 24px;">Viannd</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">Seguimiento nutricional</p>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px;">Verifica tu correo</h2>
            <p style="color: #666; font-size: 14px; margin: 0 0 24px;">Usa el siguiente código. Expira en <strong>10 minutos</strong>.</p>
            <div style="background: white; border: 2px solid #4CAF50; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: #999; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Tu código</p>
              <div style="font-size: 38px; font-weight: bold; letter-spacing: 12px; color: #1a1a1a;">${code}</div>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">Si no solicitaste este código, ignora este correo.</p>
          </div>
          <div style="background: #e8e8e3; padding: 16px 24px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2026 Viannd · Todos los derechos reservados</p>
          </div>
        </div>
      `,
         isTransactional: 'true',
      }).toString(),
   });

   const result = await response.json();
   console.log('📨 Status:', response.status);
   console.log('📨 Respuesta ElasticEmail:', JSON.stringify(result));

   if (!result.success) {
      console.error('❌ Error ElasticEmail:', result);
      throw new Error(result.error ?? 'Error al enviar el correo');
   }

   console.log('✅ Correo enviado a:', email);
};