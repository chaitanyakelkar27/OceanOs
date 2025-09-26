import { useState, useEffect } from "react";
import { api } from "@/api/api";
import { DataSubmission } from "@shared/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  MapPin, 
  Calendar,
  User,
  Building
} from "lucide-react";
import { GovernmentOnly } from "./ProtectedRoute";

export function ApprovalWorkflow() {
  const [submissions, setSubmissions] = useState<DataSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});
  const [processingReview, setProcessingReview] = useState<string | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await api.get("/submissions");
      setSubmissions(response.data.submissions);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string, action: "approve" | "reject") => {
    setProcessingReview(submissionId);
    try {
      await api.post(`/submissions/${submissionId}/review`, {
        action,
        notes: reviewNotes[submissionId] || "",
      });
      
      // Refresh the submissions list
      await loadSubmissions();
      
      // Clear the review notes for this submission
      setReviewNotes({ ...reviewNotes, [submissionId]: "" });
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to ${action} submission`);
    } finally {
      setProcessingReview(null);
    }
  };

  const updateReviewNotes = (submissionId: string, notes: string) => {
    setReviewNotes({ ...reviewNotes, [submissionId]: notes });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending Review
        </Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const reviewedSubmissions = submissions.filter(s => s.status !== "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <GovernmentOnly>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Data Submission Review</h1>
          <p className="text-gray-600 mt-2">
            Review and approve data submissions from researchers
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Review ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reviewed ({reviewedSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingSubmissions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                  <p className="text-gray-600">No pending submissions to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {pendingSubmissions.map((submission) => (
                  <Card key={submission.id} className="border-l-4 border-l-yellow-400">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {submission.title}
                            {getStatusBadge(submission.status)}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {submission.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>Researcher ID: {submission.submittedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(submission.submittedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>Type: {submission.dataType}</span>
                        </div>
                      </div>

                      {/* Data Preview */}
                      <div className="bg-gray-50 rounded-md p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Data Preview:</h4>
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(submission.data, null, 2)}
                        </pre>
                      </div>

                      {/* Attachments */}
                      {submission.attachments && submission.attachments.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Attachments:</h4>
                          <div className="space-y-1">
                            {submission.attachments.map((attachment, index) => (
                              <div key={index} className="text-sm text-blue-600">
                                📎 {attachment}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Review Section */}
                      <div className="border-t pt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review Notes (optional)
                          </label>
                          <Textarea
                            value={reviewNotes[submission.id] || ""}
                            onChange={(e) => updateReviewNotes(submission.id, e.target.value)}
                            placeholder="Add any comments or feedback..."
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleReview(submission.id, "approve")}
                            disabled={processingReview === submission.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processingReview === submission.id ? (
                              "Processing..."
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReview(submission.id, "reject")}
                            disabled={processingReview === submission.id}
                          >
                            {processingReview === submission.id ? (
                              "Processing..."
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="mt-6">
            <div className="space-y-4">
              {reviewedSubmissions.map((submission) => (
                <Card key={submission.id} className={`border-l-4 ${
                  submission.status === "approved" ? "border-l-green-400" : "border-l-red-400"
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {submission.title}
                          {getStatusBadge(submission.status)}
                        </CardTitle>
                        <CardDescription>
                          Reviewed on {formatDate(submission.reviewedAt || "")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {submission.reviewNotes && (
                    <CardContent>
                      <div className="bg-gray-50 rounded-md p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Review Notes:</h4>
                        <p className="text-sm text-gray-700">{submission.reviewNotes}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GovernmentOnly>
  );
}