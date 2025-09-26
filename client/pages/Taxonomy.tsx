import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Fish, Camera, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassificationResult {
  suggestions: Array<{
    id: string;
    scientific_name: string;
    common_name?: string;
    score: number;
    confidence: string;
  }>;
  input: {
    hasTraits: boolean;
    hasImage: boolean;
  };
  meta: {
    model: string;
    processing_time?: number;
  };
}

export default function Taxonomy() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [traits, setTraits] = useState({
    length: "",
    color: "",
    habitat: "",
    fins: ""
  });

  const classifyMutation = useMutation({
    mutationFn: async (data: { image?: File; traits?: any }) => {
      const formData = new FormData();
      if (data.image) formData.append("image", data.image);
      if (data.traits) formData.append("traits", JSON.stringify(data.traits));
      
      const response = await api.post<ClassificationResult>("/taxonomy/classify", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClassify = () => {
    if (selectedFile || Object.values(traits).some(v => v.trim())) {
      const hasTraits = Object.values(traits).some(v => v.trim());
      classifyMutation.mutate({ 
        image: selectedFile || undefined,
        traits: hasTraits ? traits : undefined 
      });
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "bg-green-100 text-green-800";
    if (score >= 0.6) return "bg-yellow-100 text-yellow-800"; 
    return "bg-red-100 text-red-800";
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return CheckCircle;
    if (score >= 0.6) return AlertCircle;
    return XCircle;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 mb-4">AI Species Identification</h1>
        <p className="mt-2 text-gray-600">
          Upload marine specimen images or enter physical characteristics to receive AI-powered species identification. 
          Our classification models are trained on marine biodiversity datasets from Indian coastal waters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Camera className="w-5 h-5" />
              Image Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              {preview ? (
                <div className="space-y-3">
                  <img src={preview} alt="Fish preview" className="max-h-48 mx-auto rounded-lg" />
                  <p className="text-sm text-foreground/70">
                    {selectedFile?.name} ({(selectedFile?.size || 0 / 1024).toFixed(1)} KB)
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Upload a fish image</p>
                    <p className="text-xs text-foreground/60">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-3 block w-full text-sm text-foreground/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
          </CardContent>
        </Card>

        {/* Traits Input Section */}
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Fish className="w-5 h-5" />
              Physical Traits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Length (cm)</label>
                <input
                  type="number"
                  value={traits.length}
                  onChange={(e) => setTraits({...traits, length: e.target.value})}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-background"
                  placeholder="e.g. 25"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Primary Color</label>
                <select
                  value={traits.color}
                  onChange={(e) => setTraits({...traits, color: e.target.value})}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-background"
                >
                  <option value="">Select color</option>
                  <option value="silver">Silver</option>
                  <option value="blue">Blue</option>
                  <option value="yellow">Yellow</option>
                  <option value="red">Red</option>
                  <option value="brown">Brown</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Habitat</label>
              <select
                value={traits.habitat}
                onChange={(e) => setTraits({...traits, habitat: e.target.value})}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-background"
              >
                <option value="">Select habitat</option>
                <option value="pelagic">Pelagic (Open Ocean)</option>
                <option value="coastal">Coastal Waters</option>
                <option value="deep_sea">Deep Sea</option>
                <option value="reef">Coral Reef</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Fin Pattern</label>
              <input
                type="text"
                value={traits.fins}
                onChange={(e) => setTraits({...traits, fins: e.target.value})}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-background"
                placeholder="e.g. forked tail, pointed dorsal"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classification Button */}
      <div className="text-center">
        <Button 
          onClick={handleClassify}
          disabled={!selectedFile && !Object.values(traits).some(v => v.trim()) || classifyMutation.isPending}
          size="lg"
          className="px-8 btn-gov"
        >
          {classifyMutation.isPending ? "Analyzing..." : "Identify Species"}
        </Button>
      </div>

      {/* Results Section */}
      {classifyMutation.data && (
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="text-gray-900">Classification Results</CardTitle>
            <div className="text-sm text-gray-600">
              Model: {classifyMutation.data.meta.model} | 
              Processing time: {classifyMutation.data.meta.processing_time || 1.2}s
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classifyMutation.data.suggestions.map((suggestion, idx) => {
                const ConfidenceIcon = getConfidenceIcon(suggestion.score);
                return (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <ConfidenceIcon className={cn("w-5 h-5", 
                          suggestion.score >= 0.8 ? "text-green-600" : 
                          suggestion.score >= 0.6 ? "text-yellow-600" : "text-red-600"
                        )} />
                        <div>
                          <p className="font-medium">{suggestion.scientific_name}</p>
                          {suggestion.common_name && (
                            <p className="text-sm text-foreground/70">{suggestion.common_name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getConfidenceColor(suggestion.score)}>
                        {Math.round(suggestion.score * 100)}% confidence
                      </Badge>
                      {suggestion.score >= 0.8 && (
                        <p className="text-xs text-green-600 mt-1">Recommended for approval</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {classifyMutation.data.suggestions.length > 0 && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Curator Review</h4>
                <p className="text-sm text-foreground/70 mb-3">
                  High-confidence results can be auto-approved. Lower confidence suggestions require curator review.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Approve Top Result
                  </Button>
                  <Button size="sm" variant="outline">
                    Request Manual Review
                  </Button>
                  <Button size="sm" variant="outline">
                    Add to Training Data
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {classifyMutation.error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span>Classification failed. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
