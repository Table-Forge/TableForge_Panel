import { useMemo, useState } from "react";
import { Search, MapPin, Users, BookOpen } from "lucide-react";
import {
  CAMPAIGNS_PAGE_SIZE,
  useInfiniteCampaigns,
} from "@/src/features/campaigns/hooks/use-infinite-campaigns";
import { TFButton } from "@/src/components/ui/tf-button";

export function CampaignsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCampaigns({ size: CAMPAIGNS_PAGE_SIZE, search });

  const campaigns = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  return (
    <div className="space-y-5">
      <header className="rounded-3xl border border-secondary/20 bg-primary/70 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Mesas disponíveis</p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Campanhas</h2>

        <label className="mt-4 flex h-12 items-center gap-3 rounded-2xl border border-white/25 bg-background/60 px-3">
          <Search size={16} className="text-white/60" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por título ou sistema"
            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </label>
      </header>

      {isLoading && campaigns.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-primary/55 p-6 text-sm text-grays-100">
          Carregando campanhas...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-2xl border border-danger/50 bg-danger/10 p-6 text-sm text-white">
          Não foi possível carregar as campanhas no momento.
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <article
            key={campaign.id}
            className="rounded-2xl border border-tertiary/25 bg-primary/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          >
            <h3 className="text-lg font-bold text-white">{campaign.title}</h3>
            <p className="mt-1 text-xs text-grays-100">por {campaign.gameMaster || "Mestre desconhecido"}</p>
            <p className="mt-3 line-clamp-3 text-sm text-white/90">{campaign.summary}</p>

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

      {campaigns.length === 0 && !isLoading && !isError ? (
        <div className="rounded-2xl border border-white/10 bg-primary/55 p-6 text-sm text-grays-100">
          Nenhuma campanha encontrada para o filtro atual.
        </div>
      ) : null}

      {hasNextPage ? (
        <div className="max-w-xs">
          <TFButton
            variant="secondary"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            text="Carregar Mais"
          />
        </div>
      ) : null}
    </div>
  );
}
