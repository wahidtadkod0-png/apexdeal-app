import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const deals = await prisma.deal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      store: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Latest Deals</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.length === 0 ? (
            <p className="text-slate-400">No deals published yet.</p>
          ) : (
            deals.map((deal) => (
              <div
                key={deal.id}
                className="border border-slate-800 rounded-xl p-4 bg-slate-900/50"
              >
                {deal.imageUrl && (
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <h2 className="font-semibold text-lg line-clamp-2">{deal.title}</h2>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-emerald-400 font-bold">
                    ₹{deal.dealPrice.toString()}
                  </span>
                  {deal.originalPrice && (
                    <span className="text-slate-500 line-through text-sm">
                      ₹{deal.originalPrice.toString()}
                    </span>
                  )}
                </div>
                <a
                  href={`/go/${deal.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Grab Deal
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
