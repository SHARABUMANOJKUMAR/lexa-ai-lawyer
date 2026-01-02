import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, AlertTriangle, Users, Gavel, BookOpen } from "lucide-react";

const TermsOfService: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last Updated: January 2025 • Governed by Indian Contract Act, 1872
          </p>
        </div>

        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">
                By accessing or using AI LeXa Lawyer ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations of India. If you disagree with any part of these terms, you may not use our services.
              </p>
              <p className="text-muted-foreground mt-4">
                These terms constitute a legally binding agreement between you and AI LeXa Lawyer, enforceable under the Indian Contract Act, 1872 and the Information Technology Act, 2000.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                2. Nature of Services - Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
                <p className="text-warning font-semibold">CRITICAL NOTICE:</p>
                <p className="text-muted-foreground">
                  AI LeXa Lawyer provides AI-powered legal information and guidance ONLY. We are NOT a law firm and do NOT provide legal representation.
                </p>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Our AI provides informational guidance based on Indian Penal Code (IPC), Bharatiya Nyaya Sanhita (BNS), Code of Criminal Procedure (CrPC), and the Indian Constitution.</li>
                <li>AI-generated documents such as FIR drafts are for reference purposes only and must be verified by qualified legal professionals.</li>
                <li>For any actual legal matter affecting your rights, you MUST consult a licensed advocate registered with the Bar Council of India.</li>
                <li>We do not guarantee the accuracy, completeness, or applicability of AI-generated legal information to your specific situation.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                3. User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">As a user of this Platform, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information in all submissions.</li>
                <li>Not misuse the platform for filing false complaints or making malicious allegations (punishable under Section 182 IPC / Section 177 BNS).</li>
                <li>Maintain confidentiality of your account credentials.</li>
                <li>Not attempt to circumvent security measures or access unauthorized areas.</li>
                <li>Comply with all applicable Indian laws while using our services.</li>
                <li>Not upload illegal, defamatory, or harmful content.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary" />
                4. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>AI LeXa Lawyer shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services.</li>
                <li>We are not responsible for any legal outcomes resulting from reliance on AI-generated information.</li>
                <li>Our maximum liability is limited to the amount paid by you for our services, if any.</li>
                <li>We do not guarantee uninterrupted or error-free service availability.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                5. Intellectual Property & Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All content, features, and functionality of the Platform are owned by AI LeXa Lawyer and protected under the Copyright Act, 1957.</li>
                <li>You retain ownership of content you upload but grant us a license to use it for providing our services.</li>
                <li>These terms are governed by the laws of India, with exclusive jurisdiction in the courts of Andhra Pradesh.</li>
                <li>Any disputes shall first be attempted to be resolved through mediation as per the Mediation Act, 2023.</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>6. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that we believe:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Violates these Terms of Service</li>
                <li>Is harmful to other users, third parties, or our business interests</li>
                <li>Constitutes illegal activity under Indian law</li>
                <li>Involves misrepresentation or fraud</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="parchment" className="text-center">
            <CardContent className="py-8">
              <p className="text-secondary-foreground mb-4">
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="font-semibold text-secondary-foreground">
                Email: legal@lexaailawyer.in
              </p>
              <p className="text-secondary-foreground text-sm mt-4">
                By using AI LeXa Lawyer, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
