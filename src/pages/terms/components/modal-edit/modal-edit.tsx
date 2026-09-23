import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/button/button";
import { ModalFooter } from "@/src/components/modals/modal-footer";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Select } from "@/src/components/select/select";
import { ControlledTextarea } from "@/src/components/input/input.textarea.controlled";
import { Label } from "@/src/components/label/label";
import { useTermsAudienceEnum } from "@/src/features/terms/hooks/enums/use-terms-enums";
import { useTermsMutations } from "@/src/features/terms/hooks/use-terms-mutations";
import {
  TermsFormSchema,
  type ITermsDocument,
  type ITermsFormData,
} from "@/src/features/terms/schemas/terms.schema";
import { useBoundStore } from "@/src/store";
import { FileUp, FileText, Code2, AlertTriangle, Info } from "lucide-react";

interface ModalEditProps {
  data?: ITermsDocument;
}

export const ModalEdit = ({ data }: ModalEditProps) => {
  const closeModal = useBoundStore((state) => state.closeModal);
  const { createMutation, updateMutation } = useTermsMutations();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: audienceOptions } = useTermsAudienceEnum(true);

  const isNewVersionMode = data ? !data.canEdit : false;

  const initialContentType: "pdf" | "html" = useMemo(() => {
    if (data?.contentHtml) return "html";
    return "pdf";
  }, [data]);

  const [contentType, setContentType] = useState<"pdf" | "html">(initialContentType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const defaultValues: ITermsFormData = useMemo(
    () => ({
      audience: data?.audience ?? "Users",
      title: data?.title ?? "",
      contentType: initialContentType,
      contentHtml: data?.contentHtml ?? "",
    }),
    [data, initialContentType],
  );

  const form = useForm<ITermsFormData>({
    resolver: zodResolver(TermsFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset(defaultValues);
    setContentType(initialContentType);
    setSelectedFile(null);
    setFileError(null);
  }, [defaultValues, initialContentType, reset]);

  const handleContentTypeChange = (type: "pdf" | "html") => {
    setContentType(type);
    setValue("contentType", type, { shouldValidate: true });
    if (type === "html") {
      setSelectedFile(null);
      setFileError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Formato de arquivo inválido! O documento deve ser enviado em PDF.");
      setSelectedFile(null);
      setValue("file", undefined, { shouldValidate: true });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("O arquivo PDF deve ter no máximo 10 MB.");
      setSelectedFile(null);
      setValue("file", undefined, { shouldValidate: true });
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    setValue("file", file, { shouldValidate: true });
  };

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();

    if (!data || isNewVersionMode) {
      formData.append("Audience", values.audience);
    }

    formData.append("Title", values.title.trim());

    if (contentType === "pdf") {
      if (selectedFile) {
        formData.append("File", selectedFile);
      }
    } else {
      if (values.contentHtml) {
        formData.append("ContentHtml", values.contentHtml.trim());
      }
    }

    if (data && data.canEdit && !isNewVersionMode) {
      updateMutation.mutate({ id: data.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isNewVersionMode && (
        <div className="flex items-start gap-3 chamfer-md border border-secondary/40 bg-secondary/10 p-3.5 text-xs text-white">
          <AlertTriangle size={18} className="text-secondary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block uppercase tracking-wider text-secondary">
              Criando nova versão
            </span>
            <p className="text-grays-100 leading-relaxed">
              O contrato v{data?.version} já entrou em vigor e não pode ser editado diretamente.
              Salvar criará uma nova versão aguardando aprovação. A versão anterior só será
              depreciada quando a nova for aprovada.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2.5 chamfer-md border border-white/10 bg-card p-3 text-xs text-grays-100">
        <Info size={16} className="text-secondary shrink-0 mt-0.5" />
        <p>
          A versão é atribuída automaticamente pelo servidor ao salvar. O novo contrato nasce como{" "}
          <strong className="text-white">Aguardando aprovação</strong> e só entra em vigor após aprovação explícita.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputGroup>
          <Label htmlFor="audience" isRequired>Público</Label>
          {data && !isNewVersionMode ? (
            <div className="rounded-lg border border-white/15 bg-background px-3.5 py-2.5 text-sm font-semibold text-white">
              {data.audience === "Users" ? "Usuários do App" : data.audience}
            </div>
          ) : (
            <Select
              hookForm={form}
              name="audience"
              title="Selecione o público"
              initialOptions={audienceOptions ?? []}
            />
          )}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="title" isRequired>Título</Label>
          <ControlledInput
            hookForm={form}
            name="title"
            placeholder="Ex: Termos e Condições de Uso"
            error={errors.title?.message}
            maxLength={150}
          />
        </InputGroup>
      </div>

      <div className="space-y-2">
        <Label isRequired>Formato do Conteúdo</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleContentTypeChange("pdf")}
            className={`flex items-center justify-center gap-2 chamfer-sm border py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              contentType === "pdf"
                ? "border-accent/60 bg-accent/15 text-white"
                : "border-white/10 bg-white/5 text-grays-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FileText size={16} />
            Arquivo PDF
          </button>
          <button
            type="button"
            onClick={() => handleContentTypeChange("html")}
            className={`flex items-center justify-center gap-2 chamfer-sm border py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              contentType === "html"
                ? "border-accent/60 bg-accent/15 text-white"
                : "border-white/10 bg-white/5 text-grays-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Code2 size={16} />
            Conteúdo HTML
          </button>
        </div>
      </div>

      {contentType === "pdf" ? (
        <InputGroup className="basis-full">
          <Label htmlFor="file" isRequired={!data?.fileUrl}>
            Upload do Documento em PDF (Máx. 10 MB)
          </Label>
          <div className="relative chamfer-md border border-dashed border-white/20 bg-white/5 p-5 text-center transition-all hover:border-white/40">
            <input
              type="file"
              id="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center chamfer-sm bg-white/5 text-secondary">
                <FileUp size={20} />
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                  <p className="text-xs text-grays-200">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : data?.fileUrl ? (
                <div>
                  <p className="text-sm font-bold text-white">
                    {data.fileName || "PDF já cadastrado"}
                  </p>
                  <p className="text-xs text-grays-200">
                    Clique para substituir o arquivo PDF
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-white">
                    Clique ou arraste o arquivo PDF aqui
                  </p>
                  <p className="text-xs text-grays-200">Apenas arquivos .pdf até 10 MB</p>
                </div>
              )}
            </div>
          </div>
          {fileError && (
            <span className="text-xs font-semibold text-danger">{fileError}</span>
          )}
        </InputGroup>
      ) : (
        <InputGroup className="basis-full">
          <Label htmlFor="contentHtml" isRequired>
            Código ou Texto HTML (Máx. 120.000 caracteres)
          </Label>
          <ControlledTextarea
            hookForm={form}
            name="contentHtml"
            placeholder="<p>Escreva ou cole aqui o conteúdo dos termos em formato HTML...</p>"
            error={errors.contentHtml?.message}
            rows={8}
            maxLength={120000}
          />
        </InputGroup>
      )}

      <ModalFooter>
        <Button buttonStyle="hollow" onClick={closeModal} type="button">
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isPending}
          disabled={isPending || (contentType === "pdf" && !selectedFile && !data?.fileUrl)}
        >
          {data && !isNewVersionMode ? "Salvar alterações" : "Cadastrar contrato"}
        </Button>
      </ModalFooter>
    </form>
  );
};
