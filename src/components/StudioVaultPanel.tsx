import React, { useMemo, useState } from 'react';
import type {
  BrandThemeId,
  BrandThemeKit,
  CanvasRatio,
  FramePreset,
  SavedLayoutPreset
} from '../pages/socialStudioPresets';
import type { CloudProjectRecord } from '../utils/studioVault';

export interface StudioVaultPanelProps {
  vaultUnlocked: boolean;
  vaultSyncing: boolean;
  onUnlockVault: (pin: string) => Promise<{ ok: boolean; error?: string }>;
  onChangePin: (newPin: string) => Promise<{ ok: boolean; error?: string }>;
  onLockVault: () => Promise<void>;
  onRefreshVault: () => Promise<void>;
  slidesCount: number;
  ratio: CanvasRatio;
  activeBrandTheme: BrandThemeKit;
  suggestedProjectTitle: string;
  activeCloudProject: CloudProjectRecord | null;
  projectSaveProgress: string;
  onSaveFinishedProject: (
    title: string,
    isFavorite: boolean,
    updateExisting: boolean
  ) => Promise<boolean>;
  projects: CloudProjectRecord[];
  onOpenProject: (project: CloudProjectRecord) => void;
  onToggleProjectFavorite: (projectId: string, nextFav: boolean) => Promise<void>;
  onDeleteProject: (project: CloudProjectRecord) => Promise<void>;
  savedLayouts: SavedLayoutPreset[];
  newPresetName: string;
  onChangeNewPresetName: (val: string) => void;
  onSaveLayoutPreset: (name?: string, isFavorite?: boolean) => Promise<void>;
  onApplySavedLayout: (saved: SavedLayoutPreset) => void;
  onToggleSavedLayoutFavorite: (id: string) => Promise<void>;
  onDeleteSavedLayout: (id: string) => Promise<void>;
  favoritePresets: FramePreset[];
  framePresetOptions: ReadonlyArray<{ key: FramePreset; label: string }>;
  onSelectBuiltInPreset: (preset: FramePreset) => void;
  onToggleBuiltInPresetFavorite: (preset: FramePreset) => void;
  allBrandThemes: BrandThemeKit[];
}

type VaultBrandFilter = 'all' | 'favorites' | 'okc' | 'raw-and-paw' | 'k9ss';

const matchesBrandFilter = (brandTheme: BrandThemeId | undefined, filter: VaultBrandFilter): boolean => {
  if (filter === 'all' || filter === 'favorites') return true;
  if (filter === 'raw-and-paw') return brandTheme === 'raw-and-paw';
  if (filter === 'k9ss') return brandTheme === 'k9ss';
  return brandTheme !== 'raw-and-paw' && brandTheme !== 'k9ss';
};

const getRatioShortLabel = (r: CanvasRatio): string =>
  r === 'story' ? '9:16' : r === 'square' ? '1:1' : '4:5';

const formatShortDate = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const slugifyTitle = (input: string): string =>
  (input || 'okc-studio')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'okc-studio';

/** Renders the PIN-protected Cloud Vault panel for favorite templates & finished projects. */
export const StudioVaultPanel: React.FC<StudioVaultPanelProps> = ({
  vaultUnlocked,
  vaultSyncing,
  onUnlockVault,
  onChangePin,
  onLockVault,
  onRefreshVault,
  slidesCount,
  ratio,
  suggestedProjectTitle,
  activeCloudProject,
  projectSaveProgress,
  onSaveFinishedProject,
  projects,
  onOpenProject,
  onToggleProjectFavorite,
  onDeleteProject,
  savedLayouts,
  newPresetName,
  onChangeNewPresetName,
  onSaveLayoutPreset,
  onApplySavedLayout,
  onToggleSavedLayoutFavorite,
  onDeleteSavedLayout,
  favoritePresets,
  framePresetOptions,
  onSelectBuiltInPreset,
  onToggleBuiltInPresetFavorite,
  allBrandThemes
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [showPinText, setShowPinText] = useState<boolean>(false);
  const [unlocking, setUnlocking] = useState<boolean>(false);
  const [unlockError, setUnlockError] = useState<string>('');

  const [showChangePin, setShowChangePin] = useState<boolean>(false);
  const [nextPinInput, setNextPinInput] = useState<string>('');
  const [pinSaving, setPinSaving] = useState<boolean>(false);
  const [pinMessage, setPinMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [projectTitleInput, setProjectTitleInput] = useState<string>('');
  const [projectSaveFav, setProjectSaveFav] = useState<boolean>(true);
  const [savingProject, setSavingProject] = useState<boolean>(false);
  const [projectSavedBanner, setProjectSavedBanner] = useState<boolean>(false);

  const [projectFilter, setProjectFilter] = useState<VaultBrandFilter>('all');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);
  const [downloadingProjectId, setDownloadingProjectId] = useState<string | null>(null);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);

  const [templateFilter, setTemplateFilter] = useState<'all' | 'favorites'>('all');
  const [saveTemplateFav, setSaveTemplateFav] = useState<boolean>(true);
  const [savingTemplate, setSavingTemplate] = useState<boolean>(false);
  const [confirmDeleteTplId, setConfirmDeleteTplId] = useState<string | null>(null);

  const presetLabelMap = useMemo(
    () => new Map(framePresetOptions.map((o) => [o.key, o.label])),
    [framePresetOptions]
  );

  const brandNameMap = useMemo(
    () => new Map(allBrandThemes.map((t) => [t.id, t])),
    [allBrandThemes]
  );

  const filteredProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    return projects.filter((p) => {
      if (projectFilter === 'favorites' && !p.isFavorite) return false;
      if (!matchesBrandFilter(p.brandTheme, projectFilter)) return false;
      if (q) {
        const hay = `${p.title} ${p.captionText} ${p.brandTheme || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [projects, projectFilter, projectSearch]);

  const filteredSavedLayouts = useMemo(() => {
    if (templateFilter === 'favorites') {
      return savedLayouts.filter((l) => l.isFavorite !== false);
    }
    return savedLayouts;
  }, [savedLayouts, templateFilter]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (unlocking) return;
    setUnlockError('');
    setUnlocking(true);
    try {
      const res = await onUnlockVault(pinInput);
      if (res.ok) {
        setPinInput('');
        setUnlockError('');
      } else {
        setUnlockError(res.error || 'Incorrect PIN passcode.');
      }
    } finally {
      setUnlocking(false);
    }
  };

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinSaving) return;
    setPinMessage(null);
    setPinSaving(true);
    try {
      const res = await onChangePin(nextPinInput);
      if (res.ok) {
        setNextPinInput('');
        setPinMessage({ ok: true, text: 'PIN updated for all devices!' });
        setTimeout(() => {
          setShowChangePin(false);
          setPinMessage(null);
        }, 1600);
      } else {
        setPinMessage({ ok: false, text: res.error || 'Could not update PIN.' });
      }
    } finally {
      setPinSaving(false);
    }
  };

  const handleTriggerSaveProject = async (updateExisting: boolean) => {
    if (savingProject) return;
    setSavingProject(true);
    setProjectSavedBanner(false);
    try {
      const resolvedTitle =
        projectTitleInput.trim() ||
        (updateExisting && activeCloudProject ? activeCloudProject.title : suggestedProjectTitle);
      const ok = await onSaveFinishedProject(resolvedTitle, projectSaveFav, updateExisting);
      if (ok) {
        setProjectTitleInput('');
        setProjectSavedBanner(true);
        setTimeout(() => setProjectSavedBanner(false), 2600);
      }
    } finally {
      setSavingProject(false);
    }
  };

  const handleDownloadOrShareProjectPngs = async (project: CloudProjectRecord) => {
    if (downloadingProjectId || project.renderedImageUrls.length === 0) return;
    setDownloadingProjectId(project.id);
    try {
      const slug = slugifyTitle(project.title);
      const files: File[] = [];
      for (let i = 0; i < project.renderedImageUrls.length; i += 1) {
        const url = project.renderedImageUrls[i];
        const resp = await fetch(url);
        if (!resp.ok) continue;
        const blob = await resp.blob();
        const fileName =
          project.renderedImageUrls.length > 1 ? `${slug}-slide-${i + 1}.png` : `${slug}.png`;
        files.push(new File([blob], fileName, { type: 'image/png' }));
      }
      if (
        files.length > 0 &&
        typeof navigator.share === 'function' &&
        navigator.canShare?.({ files })
      ) {
        try {
          await navigator.share({ files, title: project.title });
          return;
        } catch (err) {
          if ((err as Error)?.name === 'AbortError') return;
        }
      }
      if (files.length > 0) {
        for (const file of files) {
          const objUrl = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = objUrl;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(objUrl), 2500);
        }
        return;
      }
      window.open(project.renderedImageUrls[0], '_blank', 'noopener,noreferrer');
    } catch {
      if (project.renderedImageUrls[0]) {
        window.open(project.renderedImageUrls[0], '_blank', 'noopener,noreferrer');
      }
    } finally {
      setDownloadingProjectId(null);
    }
  };

  return (
    <div className="space-y-3 border-t border-[#F0ECE1] pt-3">
      {/* 1. CLOUD VAULT PIN CONNECTION CARD */}
      {!vaultUnlocked ? (
        <form
          onSubmit={handleUnlockSubmit}
          className="rounded-2xl border border-[#DDD6C7] bg-gradient-to-br from-[#FAF8F3] to-[#F1ECE0] p-3.5 space-y-2.5 shadow-xs"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold text-[#1C2621] flex items-center gap-1.5">
                <span>🔒</span>
                <span>Cloud Vault (PIN Protected)</span>
              </div>
              <p className="text-[11px] font-medium text-[#5C6B63] mt-0.5 leading-snug">
                Unlock to save &amp; sync your favorite templates, finished 1080px PNGs, editable
                projects &amp; captions across phone &amp; desktop.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type={showPinText ? 'text' : 'password'}
                inputMode="numeric"
                autoComplete="current-password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (unlockError) setUnlockError('');
                }}
                placeholder="Enter PIN passcode"
                className="w-full rounded-xl border border-[#DDD6C7] bg-white pl-3 pr-9 py-2 text-base sm:text-xs font-bold tracking-widest text-[#1C2621] outline-none focus:border-[#2E5A44]"
              />
              <button
                type="button"
                onClick={() => setShowPinText((v) => !v)}
                aria-label={showPinText ? 'Hide PIN' : 'Show PIN'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#5C6B63] hover:text-[#1C2621] cursor-pointer px-1"
              >
                {showPinText ? '🙈' : '👁'}
              </button>
            </div>
            <button
              type="submit"
              disabled={unlocking || !pinInput.trim()}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold shadow-xs hover:bg-[#244937] disabled:opacity-55 touch-manipulation cursor-pointer transition"
            >
              {unlocking ? 'Unlocking...' : '🔓 Unlock'}
            </button>
          </div>

          {unlockError && (
            <div className="rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] px-2.5 py-1.5 text-[11px] font-bold text-[#991B1B]">
              {unlockError}
            </div>
          )}
        </form>
      ) : (
        <div className="rounded-2xl border border-[#BFE0CD] bg-[#EEF6F1] p-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#204533]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>☁️ Cloud Vault Synced</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={vaultSyncing}
                onClick={onRefreshVault}
                className="px-2 py-1 rounded-lg bg-white border border-[#CDE3D6] text-[10px] font-extrabold text-[#204533] hover:bg-[#F7FBF9] disabled:opacity-60 touch-manipulation cursor-pointer"
              >
                {vaultSyncing ? '⏳ Syncing' : '🔄 Sync'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChangePin((v) => !v);
                  setPinMessage(null);
                }}
                className="px-2 py-1 rounded-lg bg-white border border-[#CDE3D6] text-[10px] font-extrabold text-[#204533] hover:bg-[#F7FBF9] touch-manipulation cursor-pointer"
              >
                🔑 Change PIN
              </button>
              <button
                type="button"
                onClick={onLockVault}
                className="px-2 py-1 rounded-lg bg-white border border-[#DDD6C7] text-[10px] font-extrabold text-[#5C6B63] hover:text-[#991B1B] touch-manipulation cursor-pointer"
              >
                🔒 Lock
              </button>
            </div>
          </div>

          {showChangePin && (
            <form
              onSubmit={handleChangePinSubmit}
              className="pt-2 border-t border-[#CDE3D6] space-y-1.5"
            >
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  value={nextPinInput}
                  onChange={(e) => setNextPinInput(e.target.value)}
                  placeholder="New 4–8 digit PIN"
                  className="flex-1 rounded-xl border border-[#CDE3D6] bg-white px-2.5 py-1.5 text-base sm:text-xs font-bold text-[#1C2621] outline-none"
                />
                <button
                  type="submit"
                  disabled={pinSaving || nextPinInput.trim().length < 4}
                  className="px-3 py-1.5 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold disabled:opacity-55 cursor-pointer"
                >
                  {pinSaving ? 'Saving...' : 'Save PIN'}
                </button>
              </div>
              {pinMessage && (
                <div
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                    pinMessage.ok
                      ? 'bg-[#DCFCE7] text-[#166534]'
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}
                >
                  {pinMessage.text}
                </div>
              )}
            </form>
          )}
        </div>
      )}

      {/* 2. SAVE FINISHED PROJECT TO CLOUD */}
      {vaultUnlocked && (
        <div className="rounded-2xl border border-[#E2DCCD] bg-white p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
              📸 Save Finished Project
            </span>
            <span className="text-[10px] font-bold text-[#5C6B63]">
              {slidesCount} Slide{slidesCount > 1 ? 's' : ''} • {getRatioShortLabel(ratio)} + Caption
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={projectTitleInput}
              onChange={(e) => setProjectTitleInput(e.target.value)}
              placeholder={suggestedProjectTitle}
              className="flex-1 min-w-0 rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-2 text-base sm:text-xs font-bold text-[#1C2621] outline-none focus:border-[#2E5A44]"
            />
            <button
              type="button"
              onClick={() => setProjectSaveFav((v) => !v)}
              title={projectSaveFav ? 'Marked as favorite project' : 'Mark as favorite'}
              className={`shrink-0 px-2.5 py-2 rounded-xl border text-xs font-extrabold touch-manipulation cursor-pointer transition ${
                projectSaveFav
                  ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                  : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#5C6B63]'
              }`}
            >
              {projectSaveFav ? '★' : '☆'}
            </button>
          </div>

          {activeCloudProject ? (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                disabled={savingProject}
                onClick={() => handleTriggerSaveProject(true)}
                className="py-2 px-2.5 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold shadow-xs disabled:opacity-60 touch-manipulation cursor-pointer truncate"
                title={`Overwrite "${activeCloudProject.title}"`}
              >
                {savingProject ? '⏳ Saving...' : '💾 Update Project'}
              </button>
              <button
                type="button"
                disabled={savingProject}
                onClick={() => handleTriggerSaveProject(false)}
                className="py-2 px-2.5 rounded-xl bg-[#D46A4E] text-white text-xs font-extrabold shadow-xs disabled:opacity-60 touch-manipulation cursor-pointer"
              >
                + Save as New
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={savingProject}
              onClick={() => handleTriggerSaveProject(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2E5A44] to-[#234735] text-white text-xs font-extrabold shadow-xs disabled:opacity-60 touch-manipulation cursor-pointer"
            >
              {savingProject
                ? projectSaveProgress || '⏳ Saving HD PNGs...'
                : `☁️ Save Finished Project (${slidesCount} Slide${slidesCount > 1 ? 's' : ''} + PNG${slidesCount > 1 ? 's' : ''})`}
            </button>
          )}

          {savingProject && projectSaveProgress && (
            <div className="text-[11px] font-bold text-[#2E5A44] bg-[#EEF6F1] px-2.5 py-1.5 rounded-xl">
              {projectSaveProgress}
            </div>
          )}

          {projectSavedBanner && !savingProject && (
            <div className="text-[11px] font-extrabold text-[#166534] bg-[#DCFCE7] border border-[#86EFAC] px-2.5 py-1.5 rounded-xl">
              ✓ Saved HD PNG{slidesCount > 1 ? 's' : ''}, editable slides &amp; caption to Cloud Vault!
            </div>
          )}
        </div>
      )}

      {/* 3. SAVED FINISHED PROJECTS GALLERY */}
      {vaultUnlocked && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
              🖼️ Finished Projects ({projects.length})
            </span>
          </div>

          {projects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {(
                [
                  ['all', `All (${projects.length})`],
                  ['favorites', `⭐ Favorites (${projects.filter((p) => p.isFavorite).length})`],
                  ['okc', '🐾 OKC'],
                  ['raw-and-paw', '🥩 Raw & Paw'],
                  ['k9ss', '⚡ K9SS']
                ] as const
              ).map(([filterKey, label]) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setProjectFilter(filterKey)}
                  className={`px-2 py-1 rounded-full text-[10px] font-extrabold border touch-manipulation cursor-pointer transition ${
                    projectFilter === filterKey
                      ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                      : 'bg-[#F6F4EE] text-[#3E4D45] border-[#DDD6C7] hover:bg-[#EFECE4]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {projects.length > 3 && (
            <input
              type="text"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              placeholder="Search saved projects or captions..."
              className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-base sm:text-xs font-medium outline-none"
            />
          )}

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredProjects.map((project) => {
                const isEditingThis = activeCloudProject?.id === project.id;
                const brandKit = project.brandTheme ? brandNameMap.get(project.brandTheme) : undefined;
                const previewImg = project.thumbnailUrl || project.renderedImageUrls[0];
                const isDeletingConfirm = confirmDeleteProjectId === project.id;
                const isDownloading = downloadingProjectId === project.id;
                const isCopied = copiedCaptionId === project.id;

                return (
                  <div
                    key={project.id}
                    className={`rounded-2xl border p-2 flex flex-col gap-1.5 bg-white transition ${
                      isEditingThis
                        ? 'border-[#2E5A44] ring-2 ring-[#2E5A44]/15'
                        : 'border-[#E2DCCD]'
                    }`}
                  >
                    <div className="relative h-36 rounded-xl bg-[#EFECE3] overflow-hidden flex items-center justify-center border border-[#EAE5D9]">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[#7C8B83]">No preview</span>
                      )}

                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded-md bg-[#1C2621]/80 text-white text-[9px] font-extrabold backdrop-blur-xs">
                          {getRatioShortLabel(project.ratio)}
                        </span>
                        {project.slideCount > 1 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#D46A4E] text-white text-[9px] font-extrabold">
                            {project.slideCount} slides
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleProjectFavorite(project.id, !project.isFavorite)}
                        title={project.isFavorite ? 'Remove star' : 'Star as favorite'}
                        className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs touch-manipulation cursor-pointer ${
                          project.isFavorite
                            ? 'bg-[#F4D37E] text-[#1C2621]'
                            : 'bg-white/90 text-[#5C6B63] border border-[#DDD6C7]'
                        }`}
                      >
                        {project.isFavorite ? '★' : '☆'}
                      </button>

                      {isEditingThis && (
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[#2E5A44] text-white text-[9px] font-extrabold">
                          Editing
                        </span>
                      )}
                    </div>

                    <div className="px-0.5 space-y-0.5">
                      <div className="text-xs font-extrabold text-[#1C2621] truncate" title={project.title}>
                        {project.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-semibold text-[#5C6B63]">
                        <span className="truncate">
                          {brandKit ? `${brandKit.icon} ${brandKit.shortName}` : '🐾 OKC Frenchies'}
                        </span>
                        <span className="shrink-0">{formatShortDate(project.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pt-0.5">
                      <button
                        type="button"
                        onClick={() => onOpenProject(project)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-[#E4EFE8] text-[#204533] text-[10px] font-extrabold hover:bg-[#D5E7DC] touch-manipulation cursor-pointer"
                      >
                        ✏️ Open
                      </button>
                      {project.renderedImageUrls.length > 0 && (
                        <button
                          type="button"
                          disabled={isDownloading}
                          onClick={() => handleDownloadOrShareProjectPngs(project)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#1C2621] text-[10px] font-extrabold hover:bg-[#EAE4D5] disabled:opacity-60 touch-manipulation cursor-pointer"
                          title="Save / Share rendered 1080px PNG(s)"
                        >
                          {isDownloading ? '⏳ PNG...' : '📲 PNG'}
                        </button>
                      )}
                      {project.captionText.trim().length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(project.captionText);
                            setCopiedCaptionId(project.id);
                            setTimeout(() => setCopiedCaptionId(null), 1800);
                          }}
                          className="py-1.5 px-2 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#3E4D45] text-[10px] font-extrabold hover:bg-[#EAE4D5] touch-manipulation cursor-pointer"
                          title="Copy saved caption"
                        >
                          {isCopied ? '✓' : '📋'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isDeletingConfirm) {
                            setConfirmDeleteProjectId(project.id);
                            setTimeout(
                              () =>
                                setConfirmDeleteProjectId((cur) =>
                                  cur === project.id ? null : cur
                                ),
                              3200
                            );
                            return;
                          }
                          setConfirmDeleteProjectId(null);
                          onDeleteProject(project);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-extrabold touch-manipulation cursor-pointer ${
                          isDeletingConfirm
                            ? 'bg-[#DC2626] text-white'
                            : 'bg-[#F6F4EE] text-[#991B1B] hover:bg-[#FEE2E2]'
                        }`}
                        title="Delete project"
                      >
                        {isDeletingConfirm ? 'Del?' : '✕'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-[#5C6B63] bg-[#FAF8F4] border border-[#EAE5D9] rounded-xl px-3 py-2">
              {projects.length === 0
                ? 'No finished projects saved yet. Hit "☁️ Save Finished Project" above to store HD PNGs + editable slides & captions!'
                : 'No saved projects match this filter.'}
            </p>
          )}
        </div>
      )}

      {/* 4. FAVORITE & CUSTOM TEMPLATES */}
      <div className="border-t border-[#F0ECE1] pt-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
            ⭐ Favorite Templates ({savedLayouts.length + favoritePresets.length})
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTemplateFilter('all')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border cursor-pointer ${
                templateFilter === 'all'
                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                  : 'bg-[#F6F4EE] text-[#5C6B63] border-[#DDD6C7]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTemplateFilter('favorites')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border cursor-pointer ${
                templateFilter === 'favorites'
                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                  : 'bg-[#F6F4EE] text-[#5C6B63] border-[#DDD6C7]'
              }`}
            >
              ⭐ Favorites
            </button>
          </div>
        </div>

        {/* Save current slide layout as reusable template */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => onChangeNewPresetName(e.target.value)}
            placeholder="Name layout (e.g. Raw & Paw Hero)"
            className="flex-1 min-w-0 rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-2 text-base sm:text-xs font-medium outline-none focus:border-[#2E5A44]"
          />
          <button
            type="button"
            onClick={() => setSaveTemplateFav((v) => !v)}
            title={saveTemplateFav ? 'Save as favorite template' : 'Save without star'}
            className={`shrink-0 px-2.5 py-2 rounded-xl border text-xs font-extrabold touch-manipulation cursor-pointer ${
              saveTemplateFav
                ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#5C6B63]'
            }`}
          >
            {saveTemplateFav ? '★' : '☆'}
          </button>
          <button
            type="button"
            disabled={savingTemplate}
            onClick={async () => {
              setSavingTemplate(true);
              try {
                await onSaveLayoutPreset(undefined, saveTemplateFav);
              } finally {
                setSavingTemplate(false);
              }
            }}
            className="shrink-0 px-3 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold disabled:opacity-60 touch-manipulation cursor-pointer"
          >
            {savingTemplate ? '⏳...' : '⭐ Save'}
          </button>
        </div>

        {/* Starred Built-in Templates */}
        {favoritePresets.length > 0 && (
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C6B63]">
              Starred Built-In Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {favoritePresets.map((presetKey) => {
                const label = presetLabelMap.get(presetKey) || presetKey;
                return (
                  <div
                    key={presetKey}
                    className="inline-flex items-center rounded-full bg-[#FEF8E6] border border-[#F2CF70] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectBuiltInPreset(presetKey)}
                      className="px-2.5 py-1 text-[11px] font-extrabold text-[#1C2621] hover:bg-[#FCEEC5] touch-manipulation cursor-pointer"
                    >
                      {label}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleBuiltInPresetFavorite(presetKey)}
                      title="Unstar preset"
                      className="pr-2 pl-1 py-1 text-[11px] font-bold text-[#B45309] hover:text-[#991B1B] cursor-pointer"
                    >
                      ★
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Saved Custom Layout Cards */}
        {filteredSavedLayouts.length > 0 ? (
          <div className="space-y-1.5">
            {filteredSavedLayouts.map((sl) => {
              const kit = sl.brandTheme ? brandNameMap.get(sl.brandTheme) : undefined;
              const isFav = sl.isFavorite !== false;
              const isConfirmDel = confirmDeleteTplId === sl.id;
              return (
                <div
                  key={sl.id}
                  className="flex items-center gap-2 bg-[#FAF8F4] border border-[#E2DCCD] rounded-xl p-1.5"
                >
                  {sl.thumbnailUrl ? (
                    <img
                      src={sl.thumbnailUrl}
                      alt={sl.name}
                      loading="lazy"
                      className="w-11 h-14 rounded-lg object-contain bg-[#EFECE3] border border-[#DDD6C7] shrink-0"
                    />
                  ) : (
                    <div
                      className="w-11 h-14 rounded-lg border border-[#DDD6C7] shrink-0 flex flex-col items-center justify-center text-sm"
                      style={{ background: sl.customBgColor || '#EFECE3' }}
                    >
                      <span>{kit?.icon || '🎨'}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onApplySavedLayout(sl)}
                    className="flex-1 min-w-0 text-left touch-manipulation cursor-pointer group"
                  >
                    <div className="text-xs font-extrabold text-[#1C2621] group-hover:text-[#2E5A44] truncate flex items-center gap-1">
                      <span className="truncate">{sl.name}</span>
                      {sl.cloudId && (
                        <span
                          className="text-[10px] text-[#2E5A44] shrink-0"
                          title="Synced to Supabase Cloud Vault"
                        >
                          ☁️
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-semibold text-[#5C6B63] truncate">
                      {kit ? `${kit.icon} ${kit.shortName}` : 'Studio'} •{' '}
                      {presetLabelMap.get(sl.preset) || sl.preset}
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onApplySavedLayout(sl)}
                      className="px-2 py-1 rounded-lg bg-[#E4EFE8] text-[#204533] text-[10px] font-extrabold hover:bg-[#D5E7DC] touch-manipulation cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSavedLayoutFavorite(sl.id)}
                      title={isFav ? 'Remove from favorites' : 'Mark as favorite'}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold touch-manipulation cursor-pointer ${
                        isFav
                          ? 'bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]/40'
                          : 'bg-white text-[#7C8B83] border border-[#DDD6C7]'
                      }`}
                    >
                      {isFav ? '★' : '☆'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isConfirmDel) {
                          setConfirmDeleteTplId(sl.id);
                          setTimeout(
                            () =>
                              setConfirmDeleteTplId((cur) => (cur === sl.id ? null : cur)),
                            3000
                          );
                          return;
                        }
                        setConfirmDeleteTplId(null);
                        onDeleteSavedLayout(sl.id);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold touch-manipulation cursor-pointer ${
                        isConfirmDel
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-white text-[#991B1B] border border-[#DDD6C7] hover:bg-[#FEE2E2]'
                      }`}
                    >
                      {isConfirmDel ? 'Del?' : '✕'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] text-[#5C6B63]">
            Save any customized frame, colors, typography &amp; overlays here to reuse on any
            puppy, stud, or Raw &amp; Paw / K9SS product in 1 tap.
          </p>
        )}
      </div>
    </div>
  );
};

