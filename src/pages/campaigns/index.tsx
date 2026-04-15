import { Paginate } from "@/src/components";
import { InfoNotFound } from "@/src/components/page-handler/info-not-found";
import { SkeletonTable } from "@/src/components/skeleton/skeleton-table";
import {
  CAMPAIGNS_PAGE_SIZE,
  useCampaigns,
} from "@/src/features/campaigns/hooks/use-campaigns";
import { BookOpen, MapPin, Users } from "lucide-react";
import { useMemo, useState } from "react";

export function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCampaigns({
    page,
    size: CAMPAIGNS_PAGE_SIZE,
    search,
  });

  const campaigns = data?.items ?? [];

  const paginationData = useMemo(
    () => ({
      page: data?.page ?? page,
      itemsPerPage: data?.size ?? CAMPAIGNS_PAGE_SIZE,
      filteredItems: data?.totalItems ?? campaigns.length,
    }),
    [campaigns.length, data?.page, data?.size, data?.totalItems, page],
  );

  if (isLoading && campaigns.length === 0) return <SkeletonTable />;
  if (isError) return <InfoNotFound />;

  return (
    <>
      <header className="rounded-3xl border border-secondary/20 bg-primary/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
          Mesas disponíveis
        </p>
        <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
          Campanhas
        </h1>
      </header>

      <div className="mt-4 rounded-2xl border border-white/10 bg-primary/55 p-3">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar campanha por título ou sistema"
          className="h-10 w-full rounded-xl border border-white/15 bg-background/60 px-3 text-sm text-white outline-none placeholder:text-white/35"
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <article
            key={campaign.id}
            className="rounded-2xl border border-tertiary/25 bg-primary/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          >
            <h3 className="text-lg font-bold text-white">{campaign.title}</h3>
            <p className="mt-1 text-xs text-grays-100">
              por {campaign.gameMaster || "Mestre desconhecido"}
            </p>
            <p className="mt-3 line-clamp-3 text-sm text-white/90">
              {campaign.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-xl border border-secondary/30 bg-secondary/15 px-2 py-1 text-xs text-white/90">
                <MapPin size={13} />
                {campaign.location}
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl border border-secondary/30 bg-secondary/15 px-2 py-1 text-xs text-white/90">
                <BookOpen size={13} />
                {campaign.system}
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl border border-secondary/30 bg-secondary/15 px-2 py-1 text-xs text-white/90">
                <Users size={13} />
                {`${campaign.currentPartySize}/${campaign.maxPartySize}`}
              </span>
            </div>
          </article>
        ))}
      </section>

      {campaigns.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-primary/55 p-6 text-sm text-grays-100">
          Nenhuma campanha encontrada para o filtro atual.
        </div>
      ) : null}

      <Paginate paginationData={paginationData} onPageChange={setPage} />
    </>
  );
}
