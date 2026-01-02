import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CheckCircle, Users, Gavel } from "lucide-react";

const TermsOfService: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
            <h1 className="font-serif text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last Updated: January 2025
            </p>
          </div>

          <div className="space-y-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Scale className="w-5 h-5 text-primary" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  By accessing and using AI LeXa Lawyer - Smart Judiciary of India, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                </p>
                <p>
                  If you do not agree with any of these terms, you are prohibited from using or accessing this platform. The materials contained in this platform are protected by applicable copyright and trademark law.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Services Provided
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>AI LeXa Lawyer provides the following services:</p>
                <ul>
                  <li>AI-powered legal guidance and information based on Indian laws</li>
                  <li>FIR draft generation and legal document templates</li>
                  <li>Case management and tracking tools</li>
                  <li>Evidence upload and management</li>
                  <li>Connection to legal professionals (where available)</li>
                  <li>Educational resources on Indian legal system</li>
                </ul>
                <p>
                  <strong>Important:</strong> Our services provide legal information and guidance only. We do not provide legal advice, representation, or act as your attorney. For specific legal matters, always consult a qualified advocate licensed to practice in India.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Users className="w-5 h-5 text-primary" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>As a user of this platform, you agree to:</p>
                <ul>
                  <li>Provide accurate and truthful information in all submissions</li>
                  <li>Use the platform only for lawful purposes</li>
                  <li>Not submit false or misleading FIR complaints</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Not attempt to manipulate or abuse the AI system</li>
                  <li>Respect the intellectual property rights of the platform</li>
                  <li>Not use the platform for any fraudulent or illegal activities</li>
                </ul>
                <p>
                  Filing a false FIR is a punishable offence under Section 182 of the Indian Penal Code / Section 177 of the Bharatiya Nyaya Sanhita. Users are solely responsible for the accuracy of information provided.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Limitations & Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <h4>AI Limitations</h4>
                <ul>
                  <li>AI responses are based on available legal databases and may not cover all scenarios</li>
                  <li>The AI provides general guidance and may not account for specific case nuances</li>
                  <li>Legal interpretations may vary and should be verified by legal professionals</li>
                </ul>

                <h4>Service Availability</h4>
                <ul>
                  <li>We do not guarantee uninterrupted access to the platform</li>
                  <li>Services may be modified or discontinued without prior notice</li>
                  <li>We are not liable for any damages arising from service interruptions</li>
                </ul>

                <h4>Document Validity</h4>
                <ul>
                  <li>Generated FIR drafts are for guidance purposes only</li>
                  <li>Official FIRs must be filed at the appropriate police station</li>
                  <li>Documents generated do not have legal standing until officially filed</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Gavel className="w-5 h-5 text-primary" />
                  Governing Law & Jurisdiction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or the use of the platform shall be subject to the exclusive jurisdiction of the courts in Andhra Pradesh, India.
                </p>
                <p>
                  The platform operates in compliance with:
                </p>
                <ul>
                  <li>Information Technology Act, 2000</li>
                  <li>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</li>
                  <li>Consumer Protection Act, 2019</li>
                  <li>Applicable data protection regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="parchment">
              <CardContent className="pt-6">
                <p className="text-sm text-secondary-foreground">
                  <strong>Modifications:</strong> We reserve the right to modify these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.
                </p>
                <p className="text-sm text-secondary-foreground mt-4">
                  <strong>Contact:</strong> For questions about these Terms, contact us at sharabumanojachari@gmail.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
