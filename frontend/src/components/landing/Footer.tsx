export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 text-sm text-[#6B7280]">
      <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-4">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4a7c65] to-[#3d6653] text-white">
              <span className="text-lg">🩺</span>
            </div>
            <span className="font-bold text-[#1F2937]">HealthSync Pro</span>
          </div>
          <p className="mb-4">Gestão inteligente para oferecer saúde de excelência.</p>
          <p>© 2024 HealthSync.</p>
        </div>

        <div>
          <h4 className="font-bold text-[#1F2937] mb-4">Produto</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#4a7c65]">Funcionalidades</a></li>
            <li><a href="#" className="hover:text-[#4a7c65]">Preços</a></li>
            <li><a href="#" className="hover:text-[#4a7c65]">Atualizações</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#1F2937] mb-4">Empresa</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#4a7c65]">Sobre nós</a></li>
            <li><a href="#" className="hover:text-[#4a7c65]">Carreiras</a></li>
            <li><a href="#" className="hover:text-[#4a7c65]">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#1F2937] mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-[#4a7c65]">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-[#4a7c65]">Privacidade</a></li>
            <li><a href="#" className="hover:text-[#4a7c65]">Compliance LGPD</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
