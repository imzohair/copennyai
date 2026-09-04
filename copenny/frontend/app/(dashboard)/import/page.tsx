"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ImportTransactionsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Generate a quick preview
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (results) => {
          setPreview(results.data);
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"]
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/transactions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const { summary } = res.data;
      toast.success(`Imported ${summary.imported} transactions successfully.`);
      if (summary.errors > 0) {
        toast.warning(`${summary.errors} rows had errors and were skipped.`);
      }
      
      setTimeout(() => {
        router.push("/transactions");
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to import CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Transactions</h1>
        <p className="text-muted-foreground mt-1">Upload your bank statement CSV to auto-categorize and sync.</p>
      </div>

      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div 
            {...getRootProps()} 
            className={`p-16 border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"}
            `}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Drag & drop your CSV here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {file && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <FileType className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button onClick={handleUpload} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {loading ? "Importing..." : "Confirm & Import"}
            </Button>
          </div>

          {preview.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                Data Preview (First 5 rows)
              </h3>
              <div className="rounded-md border border-border overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      {Object.keys(preview[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-2 font-medium truncate max-w-[150px]">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {preview.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="px-4 py-2 truncate max-w-[200px]">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
