import Link from "next/link";
import { routes } from "@/lib/site";

export default function NotFound() {
  return (
    <main id="main" className="wrap grid min-h-[70vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-[8rem] font-bold leading-none text-white/10 sm:text-[12rem]">−404°</p>
        <h1 className="h2 -mt-6">Эта страница замёрзла</h1>
        <p className="lead mx-auto mt-4 max-w-md">Такого адреса нет. Зато есть каталог неисправностей и прайс.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-ice">На главную</Link>
          <Link href={routes.faults} className="btn-ghost">Неисправности</Link>
          <Link href={routes.prices} className="btn-ghost">Цены</Link>
        </div>
      </div>
    </main>
  );
}
