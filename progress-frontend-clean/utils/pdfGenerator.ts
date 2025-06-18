import jsPDF from 'jspdf';

interface BusinessCalculatorData {
  businessType: {
    businessName?: string;
    businessType: string;
    industry: string;
  };
  financials: {
    annualRevenue: number;
    monthlyExpenses: number;
  };
  growth: {
    revenueGrowthTarget: string;
    plannedInvestment: string;
    plannedHires: string;
  };
}

interface CalculatorResults {
  breakEvenPoint: string;
  cashFlowForecast: string;
  grossProfitMargin: string;
  costToIncomeRatio: string;
  taxSetAside: string;
  hiringImpact: string;
  recommendedAreas: string[];
  insight: string;
}

interface SMEData {
  businessName: string;
  industry: string;
  challenges: string[];
  priorityAreas: string[];
  recommendations: string[];
  nextSteps: string[];
}

const LOGO_URL = 'https://res.cloudinary.com/drl0fxrkq/image/upload/v1750110115/Dark_Logo_wn99nu.png';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const addHeaderWithLogo = async (doc: jsPDF, title: string) => {
  try {
    const logo = await loadImage(LOGO_URL);
    
    // Add logo (top left)
    const logoWidth = 40;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    doc.addImage(logo, 'PNG', 20, 15, logoWidth, logoHeight);
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text(title, 20, 50);
    
    // Add date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 20, 60);
    
    return 70; // Return Y position for content start
  } catch (error) {
    console.warn('Could not load logo, proceeding without it');
    // Fallback without logo
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text(title, 20, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 20, 40);
    
    return 50;
  }
};

const addSection = (doc: jsPDF, title: string, content: string[], yPos: number): number => {
  // Section title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 63, 228); // Progress Accountants purple
  doc.text(title, 20, yPos);
  
  yPos += 10;
  
  // Section content
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  
  content.forEach(line => {
    if (yPos > 270) { // Page break check
      doc.addPage();
      yPos = 20;
    }
    
    const lines = doc.splitTextToSize(line, 170);
    lines.forEach((splitLine: string) => {
      doc.text(splitLine, 20, yPos);
      yPos += 5;
    });
    yPos += 2; // Extra spacing between items
  });
  
  return yPos + 5; // Return new Y position
};

const addFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 280, 190, 280);
    
    // Footer text
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Progress Accountants | info@progressaccountants.co.uk | progressaccountants.co.uk', 20, 288);
    doc.text(`Page ${i} of ${pageCount}`, 170, 288);
  }
};

export const generateBusinessCalculatorPDF = async (
  data: BusinessCalculatorData,
  results: CalculatorResults
): Promise<Blob> => {
  const doc = new jsPDF();
  
  let yPos = await addHeaderWithLogo(doc, 'BUSINESS ANALYSIS REPORT');
  
  // Business Profile Section
  const businessType = data.businessType.businessType.replace(/_/g, ' ').toUpperCase();
  const industry = data.businessType.industry.replace(/_/g, ' ').toUpperCase();
  
  const businessProfile = [
    `Business Name: ${data.businessType.businessName || 'Your Business'}`,
    `Business Type: ${businessType}`,
    `Industry: ${industry}`,
    `Annual Revenue: £${data.financials.annualRevenue.toLocaleString()}`,
    `Monthly Expenses: £${data.financials.monthlyExpenses.toLocaleString()}`
  ];
  
  yPos = addSection(doc, 'BUSINESS PROFILE', businessProfile, yPos);
  
  // Financial Analysis Section
  const financialAnalysis = [
    `Break-Even Point: ${results.breakEvenPoint}`,
    `Cash Flow Forecast: ${results.cashFlowForecast}`,
    `Gross Profit Margin: ${results.grossProfitMargin}`,
    `Cost-to-Income Ratio: ${results.costToIncomeRatio}`,
    `Recommended Tax Reserve: ${results.taxSetAside}`
  ];
  
  yPos = addSection(doc, 'FINANCIAL ANALYSIS', financialAnalysis, yPos);
  
  // Growth Planning Section
  const growthPlanning = [
    `Revenue Growth Target: ${data.growth.revenueGrowthTarget.replace(/_/g, ' ')}`,
    `Planned Investment: ${data.growth.plannedInvestment.replace(/_/g, ' ')}`,
    `Planned Hires: ${data.growth.plannedHires}`,
    `Hiring Impact: ${results.hiringImpact}`
  ];
  
  yPos = addSection(doc, 'GROWTH PLANNING', growthPlanning, yPos);
  
  // Recommended Focus Areas
  const focusAreas = results.recommendedAreas.map((area, index) => `${index + 1}. ${area}`);
  yPos = addSection(doc, 'RECOMMENDED FOCUS AREAS', focusAreas, yPos);
  
  // Business Insights
  yPos = addSection(doc, 'BUSINESS INSIGHTS', [results.insight], yPos);
  
  // Next Steps
  const nextSteps = [
    '1. Review your monthly cash flow projections',
    '2. Evaluate opportunities for cost optimization',
    '3. Plan for upcoming tax obligations',
    '4. Consider professional financial advisory services'
  ];
  
  yPos = addSection(doc, 'NEXT STEPS', nextSteps, yPos);
  
  addFooter(doc);
  
  return doc.output('blob');
};

export const generateSMEHubPDF = async (data: SMEData): Promise<Blob> => {
  const doc = new jsPDF();
  
  let yPos = await addHeaderWithLogo(doc, 'SME SUPPORT ASSESSMENT');
  
  // Business Overview
  const businessOverview = [
    `Business Name: ${data.businessName}`,
    `Industry: ${data.industry}`,
    `Assessment Date: ${new Date().toLocaleDateString('en-GB')}`
  ];
  
  yPos = addSection(doc, 'BUSINESS OVERVIEW', businessOverview, yPos);
  
  // Identified Challenges
  const challenges = data.challenges.map((challenge, index) => `${index + 1}. ${challenge}`);
  yPos = addSection(doc, 'IDENTIFIED CHALLENGES', challenges, yPos);
  
  // Priority Areas
  const priorities = data.priorityAreas.map((area, index) => `${index + 1}. ${area}`);
  yPos = addSection(doc, 'PRIORITY AREAS FOR IMPROVEMENT', priorities, yPos);
  
  // Recommendations
  const recommendations = data.recommendations.map((rec, index) => `${index + 1}. ${rec}`);
  yPos = addSection(doc, 'OUR RECOMMENDATIONS', recommendations, yPos);
  
  // Next Steps
  const nextSteps = data.nextSteps.map((step, index) => `${index + 1}. ${step}`);
  yPos = addSection(doc, 'RECOMMENDED NEXT STEPS', nextSteps, yPos);
  
  // Contact Information
  const contactInfo = [
    'Ready to take the next step? Contact Progress Accountants today.',
    '',
    'Email: info@progressaccountants.co.uk',
    'Website: progressaccountants.co.uk',
    '',
    'Our experienced team is ready to help you overcome these challenges',
    'and achieve your business goals.'
  ];
  
  yPos = addSection(doc, 'GET PROFESSIONAL SUPPORT', contactInfo, yPos);
  
  addFooter(doc);
  
  return doc.output('blob');
};