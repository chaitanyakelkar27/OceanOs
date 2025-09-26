import { useState } from "react";
import { api } from "@/api/api";
import { useAuth } from "@/hooks/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Info, MapPin, Calendar } from "lucide-react";
import { ResearcherOnly } from "@/components/ProtectedRoute";

export default function DataUpload() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dataType: "" as "observation" | "sensor" | "species" | "other" | "",
    data: "",
    attachments: [] as string[],
  });
  const [files, setFiles] = useState<File[]>([]);

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    // In a real application, you would upload files to a cloud storage service
    // For now, we'll simulate file upload and return mock URLs
    const uploadPromises = files.map(async (file) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock URL - in production this would be actual uploaded file URL
      return `https://oceanos-storage.example.com/uploads/${Date.now()}-${file.name}`;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Parse JSON data if provided
      let parsedData = {};
      if (formData.data.trim()) {
        try {
          parsedData = JSON.parse(formData.data);
        } catch {
          throw new Error("Invalid JSON format in data field");
        }
      }

      // Upload files first (if any)
      let attachmentUrls: string[] = [];
      if (files.length > 0) {
        attachmentUrls = await uploadFiles(files);
      }

      await api.post("/submissions", {
        title: formData.title,
        description: formData.description,
        dataType: formData.dataType,
        data: parsedData,
        attachments: attachmentUrls,
      });

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        dataType: "",
        data: "",
        attachments: [],
      });
      setFiles([]);
      // Clear file input
      const fileInput = document.getElementById("attachments") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadExample = (type: string) => {
    const examples = {
      species: {
        title: "Coral Species Survey - Great Barrier Reef",
        description: "New coral species identification and health assessment in the northern section of the Great Barrier Reef. This study documents the presence of rare Acropora species and their symbiotic relationships.",
        data: JSON.stringify({
          species: "Acropora cervicornis",
          commonName: "Staghorn coral",
          location: { lat: -16.2839, lng: 145.7781 },
          depth: 15,
          temperature: 26.5,
          salinity: 35.2,
          pH: 8.1,
          observations: "Healthy colony with active polyp extension",
          colonySize: "2.5 meters diameter",
          healthStatus: "excellent",
          threats: ["bleaching risk", "crown-of-thorns starfish"],
          photographicEvidence: true
        }, null, 2)
      },
      observation: {
        title: "Marine Biodiversity Assessment - Ningaloo Reef",
        description: "Comprehensive biodiversity survey documenting fish populations, coral health, and water quality parameters at multiple sites along Ningaloo Reef.",
        data: JSON.stringify({
          surveyDate: "2024-09-20",
          location: { lat: -22.7094, lng: 113.7781 },
          depth: 12,
          visibility: "25 meters",
          currentStrength: "moderate",
          fishSpeciesCount: 47,
          coralCoverPercentage: 78,
          waterQuality: {
            temperature: 24.8,
            salinity: 35.4,
            pH: 8.2,
            dissolvedOxygen: 7.8,
            turbidity: "low"
          },
          notableSpecies: ["Whale shark", "Manta ray", "Green turtle"],
          threats: ["tourism pressure", "marine debris"]
        }, null, 2)
      },
      sensor: {
        title: "Ocean Temperature Monitoring - Torres Strait",
        description: "Continuous temperature and salinity monitoring from autonomous sensors deployed in Torres Strait. Data collection period: 6 months with hourly measurements.",
        data: JSON.stringify({
          stationId: "TS-001",
          deploymentDate: "2024-03-15",
          location: { lat: -10.1525, lng: 142.2146 },
          sensorDepth: 8,
          measurements: [
            { timestamp: "2024-09-20T00:00:00Z", temperature: 26.2, salinity: 34.8, pressure: 1013.2 },
            { timestamp: "2024-09-20T01:00:00Z", temperature: 26.1, salinity: 34.9, pressure: 1013.1 },
            { timestamp: "2024-09-20T02:00:00Z", temperature: 26.0, salinity: 34.8, pressure: 1013.0 }
          ],
          calibrationDate: "2024-03-10",
          dataQuality: "excellent",
          anomalies: []
        }, null, 2)
      }
    };

    if (examples[type]) {
      setFormData({
        ...formData,
        title: examples[type].title,
        description: examples[type].description,
        data: examples[type].data,
      });
    }
  };

  return (
    <ResearcherOnly>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Submit Data for Approval</h1>
          <p className="text-gray-600 mt-2">
            Upload your research data for government review and approval. Once approved, 
            your data will be made available to the broader research community.
          </p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              Data submitted successfully! Your submission is now pending government review.
              You can track its status in your submissions dashboard.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="card-gov">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Upload className="h-5 w-5" />
                  Data Submission Form
                </CardTitle>
                <CardDescription>
                  Provide details about your research data and submit it for approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Coral Reef Species Survey - Great Barrier Reef"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide a detailed description of your data, methodology, and findings..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataType">Data Type *</Label>
                    <Select 
                      value={formData.dataType} 
                      onValueChange={(value: any) => setFormData({ ...formData, dataType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of data you're submitting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="observation">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Field Observation
                          </div>
                        </SelectItem>
                        <SelectItem value="sensor">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Sensor Data
                          </div>
                        </SelectItem>
                        <SelectItem value="species">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Species Identification
                          </div>
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data">Research Data (JSON Format)</Label>
                      {formData.dataType && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => loadExample(formData.dataType)}
                          className="btn-gov-outline"
                        >
                          Load Example
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="data"
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      placeholder={`Enter your research data in JSON format. Include measurements, observations, coordinates, and any relevant parameters...`}
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      Enter your data in valid JSON format. Click "Load Example" for sample data structures.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachments">File Attachments (Optional)</Label>
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.csv,.txt,.json,.xlsx,.xls"
                      onChange={(e) => {
                        const fileList = Array.from(e.target.files || []);
                        setFiles(fileList);
                        setFormData({ 
                          ...formData, 
                          attachments: fileList.map(f => f.name)
                        });
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {files.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Selected files:</p>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Supported formats: Images (JPG, PNG), Documents (PDF), Data files (CSV, Excel, JSON, TXT). Max 10MB per file.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.title || !formData.description || !formData.dataType}
                      className="flex-1 btn-gov"
                    >
                      {isSubmitting ? "Submitting..." : "Submit for Government Approval"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => window.history.back()}
                      className="btn-gov-outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Submission Info */}
            <Card className="card-gov">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Submission Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">1. Submit Data</h4>
                    <p className="text-xs text-gray-600">Upload your research data with detailed descriptions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-yellow-100 p-2">
                    <Info className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">2. Government Review</h4>
                    <p className="text-xs text-gray-600">Officials review for quality and compliance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">3. Publication</h4>
                    <p className="text-xs text-gray-600">Approved data becomes available to researchers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Info */}
            <Card className="card-gov">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Submitter Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Name</Label>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Role</Label>
                  <Badge variant="outline" className="text-xs">
                    {user?.role}
                  </Badge>
                </div>
                {user?.organization && (
                  <div>
                    <Label className="text-xs text-gray-500">Organization</Label>
                    <p className="text-sm">{user.organization}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Guidelines */}
            <Card className="card-gov">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Data Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">Required Fields:</h4>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>• Geographic coordinates (lat, lng)</li>
                    <li>• Date/time of collection</li>
                    <li>• Measurement methodology</li>
                    <li>• Data quality indicators</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Best Practices:</h4>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>• Use standardized units</li>
                    <li>• Include metadata</li>
                    <li>• Document any anomalies</li>
                    <li>• Provide context and methods</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ResearcherOnly>
  );
}
