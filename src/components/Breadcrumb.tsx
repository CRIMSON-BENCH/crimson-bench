import JsonLd from './JsonLd'
import { breadcrumbSchema } from '@/lib/schema'

interface BreadcrumbItem { name: string; href: string }

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schemaItems = items.map(i => ({
    name: i.name,
    url: `https://www.crimsonbench.com${i.href}`,
  }))

  return (
    <>
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-6 py-3">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-slate-500 dark:text-slate-500">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300 dark:text-slate-700">›</span>}
              {i < items.length - 1 ? (
                <a href={item.href} className="hover:text-[#B01C24] transition-colors uppercase">
                  {item.name}
                </a>
              ) : (
                <span className="text-slate-700 dark:text-slate-300 uppercase">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
