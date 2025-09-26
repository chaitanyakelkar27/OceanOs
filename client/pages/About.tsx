export default function About() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-medium text-gray-900 mb-6">About This Platform</h1>
      <div className="space-y-6">
        <div className="card-gov p-6">
          <p className="text-gray-700 leading-relaxed">
            OceanOS is an advanced AI-driven unified data platform for oceanographic, fisheries, and molecular biodiversity research. 
            Built to support the Centre for Marine Living Resources and Ecology (CMLRE), Kochi, under the Ministry of Earth Sciences (MoES), Government of India.
          </p>
        </div>

        <div className="card-gov p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">About CMLRE</h2>
          <p className="text-gray-700 leading-relaxed">
            CMLRE organizes and promotes ocean development activities in India, focusing on mapping, assessing, and managing marine living resources 
            in the Indian Exclusive Economic Zone (EEZ). The Marine Living Resources Programme supports ecosystem-based research and monitoring initiatives.
          </p>
        </div>

        <div className="card-gov p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Research Modules</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span><strong>Taxonomy Assistant</strong> — Curator-in-the-loop species classification system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span><strong>Otolith Morphometrics</strong> — Interactive shape analysis and measurement tools</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span><strong>eDNA Browser</strong> — Molecular hits and species matching capabilities</span>
            </li>
          </ul>
        </div>

        <div className="card-gov p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Data Sources</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span><strong>Oceanography</strong> — Physical, chemical, and biological parameters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span><strong>Fisheries</strong> — Abundance, diversity, life history, and ecomorphology data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span><strong>Taxonomy</strong> — Morphological characteristics and otolith data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-medium">•</span>
              <span><strong>Molecular Biology</strong> — Environmental DNA and genetic analysis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
