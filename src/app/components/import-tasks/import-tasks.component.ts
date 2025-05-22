import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf/ngSwitch
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http'; // Import HttpParams
import { Component, OnInit } from '@angular/core'; // Import OnInit
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ActivatedRoute, Router } from '@angular/router'; // Inject ActivatedRoute and Router
import { v4 as uuidv4 } from 'uuid'; // Import uuid for state generation
import { LoadingService } from '../../services/loading.service'; // Import LoadingService
import { Project, ProjectService } from '../../services/project.service'; // Import ProjectService and Project interface

interface ImportSuccessResponse {
  message: string;
  projectId?: string; // Include projectId in success response for navigation
}

@Component({
  selector: 'app-import-tasks',
  standalone: true, // Mark as standalone
  imports: [CommonModule, HttpClientModule, FormsModule], // Import necessary modules
  templateUrl: './import-tasks.component.html',
  styleUrl: './import-tasks.component.css',
})
export class ImportTasksComponent implements OnInit {
  // Implement OnInit
  selectedSource: 'azure-devops' | 'trello' | null = null;
  backendUrl = 'http://localhost:3000'; // TODO: Configure your backend URL
  importStatus: string | null = null;
  importError: string | null = null;
  tokenId: string | null = null; // Store the obtained token ID
  state: string | null = null; // Store the state parameter for OAuth

  // Properties for import details form
  azureDevOpsOrganizationUrl: string = '';
  azureDevOpsProjectId: string = '';
  trelloBoardId: string = '';

  projects: Project[] = []; // List of available projects
  selectedProject: Project | null = null; // Selected project object

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private router: Router, // Inject Router
    private projectService: ProjectService, // Inject ProjectService
    private loadingService: LoadingService // Inject LoadingService
  ) {}

  ngOnInit(): void {
    // Check if the current URL is an OAuth callback
    if (this.router.url.startsWith('/import/azure-devops/callback')) {
      this.handleAzureDevOpsCallback();
    } else if (this.router.url.startsWith('/import/trello/callback')) {
      this.handleTrelloCallback();
    } else {
      // If not a callback, attempt to retrieve tokenId and source from localStorage
      const storedTokenId = localStorage.getItem('importTokenId');
      const storedSource = localStorage.getItem('importSource') as
        | 'azure-devops'
        | 'trello'
        | null;

      if (storedTokenId && storedSource) {
        this.tokenId = storedTokenId;
        this.selectedSource = storedSource;
        this.fetchProjects(); // Fetch projects if a token is available
      } else {
        // If no token is stored and not a callback, fetch projects to display the initial form
        this.fetchProjects();
      }
    }
  }

  fetchProjects(): void {
    this.loadingService.show(); // Show loading indicator
    this.importStatus = 'Fetching projects...';
    this.projectService.getProjects().subscribe(
      (projects) => {
        this.projects = projects;
        this.importStatus = null; // Clear status after fetching
        this.loadingService.hide(); // Hide loading indicator
      },
      (error) => {
        console.error('Error fetching projects:', error);
        this.importStatus = null;
        this.importError = 'Failed to fetch projects. Please try again later.';
        this.loadingService.hide(); // Hide loading indicator
      }
    );
  }

  selectSource(source: 'azure-devops' | 'trello'): void {
    console.log('selectSource called with:', source);
    this.selectedSource = source;
    this.importStatus = null; // Reset status
    this.importError = null; // Reset error
  }

  initiateImport(): void {
    console.log('Entering initiateImport method.');
    console.log('initiateImport called for source:', this.selectedSource);
    if (this.selectedSource === 'azure-devops') {
      this.initiateAzureDevOpsImport();
    } else if (this.selectedSource === 'trello') {
      this.initiateTrelloImport();
    }
  }

  initiateAzureDevOpsImport(): void {
    console.log('initiateAzureDevOpsImport called');
    this.loadingService.show(); // Show loading indicator
    this.importStatus = 'Initiating Azure DevOps import...';
    this.importError = null;
    this.state = uuidv4(); // Generate a unique state

    // Store the state parameter temporarily (e.g., in localStorage or a service)
    // In a real application, this should be associated with the user's session on the backend.
    localStorage.setItem('azureDevOpsOAuthState', this.state);

    const params = new HttpParams().set('state', this.state); // Use HttpParams

    console.log('Making HTTP GET request to Azure DevOps initiate endpoint');
    this.http
      .get<{ url: string }>(`${this.backendUrl}/import/azure-devops/initiate`, {
        params,
      }) // Pass state as HttpParams
      .subscribe(
        (response) => {
          this.importStatus = 'Redirecting to Azure DevOps...';
          this.loadingService.hide(); // Hide loading indicator before redirect
          // Redirect the user to the Azure DevOps authorization URL
          window.location.href = response.url;
        },
        (error) => {
          console.error('Error initiating Azure DevOps import:', error);
          this.importStatus = null;
          this.importError =
            error.error?.message || 'Failed to initiate Azure DevOps import.';
          this.loadingService.hide(); // Hide loading indicator
          // TODO: Display more specific error message to the user
        }
      );
  }

  initiateTrelloImport(): void {
    console.log('initiateTrelloImport called');
    this.loadingService.show(); // Show loading indicator
    this.importStatus = 'Initiating Trello import...';
    this.importError = null;
    console.log('Making HTTP GET request to Trello initiate endpoint');
    this.http
      .get<{ url: string }>(`${this.backendUrl}/import/trello/initiate`)
      .subscribe(
        (response) => {
          this.importStatus = 'Redirecting to Trello...';
          this.loadingService.hide(); // Hide loading indicator before redirect
          // Redirect the user to the Trello authorization URL
          window.location.href = response.url;
        },
        (error) => {
          console.error('Error initiating Trello import:', error);
          this.importStatus = null;
          this.importError =
            error.error?.message || 'Failed to initiate Trello import.';
          this.loadingService.hide(); // Hide loading indicator
          // TODO: Display more specific error message to the user
        }
      );
  }

  handleAzureDevOpsCallback(): void {
    this.loadingService.show(); // Show loading indicator
    this.importStatus = 'Handling Azure DevOps callback...';
    this.importError = null;

    // Extract the authorization code and state from the query parameters
    const code = this.route.snapshot.queryParams['code'];
    const state = this.route.snapshot.queryParams['state'];

    // Retrieve the stored state and validate it
    const storedState = localStorage.getItem('azureDevOpsOAuthState');
    if (!state || state !== storedState) {
      console.error(
        'Invalid or missing state parameter in Azure DevOps callback.'
      );
      this.importStatus = null;
      this.importError = 'OAuth state validation failed. Possible CSRF attack.';
      this.loadingService.hide(); // Hide loading indicator
      localStorage.removeItem('azureDevOpsOAuthState'); // Clear the stored state
      return;
    }

    // Clear the stored state after successful validation
    localStorage.removeItem('azureDevOpsOAuthState');

    if (code) {
      const params = new HttpParams().set('code', code).set('state', state); // Use HttpParams
      // Send the code and state to the backend callback endpoint
      this.http
        .get<{ success: boolean; message?: string; tokenId?: string }>(
          `${this.backendUrl}/import/azure-devops/callback`,
          { params }
        )
        .subscribe(
          // Pass state as HttpParams
          (response) => {
            this.loadingService.hide(); // Hide loading indicator
            if (response.success && response.tokenId) {
              this.importStatus =
                'Azure DevOps authentication successful. Token obtained.';
              this.tokenId = response.tokenId;
              this.selectedSource = 'azure-devops'; // Set source after callback
              localStorage.setItem('importTokenId', this.tokenId); // Store tokenId in localStorage
              localStorage.setItem('importSource', this.selectedSource); // Store source in localStorage
              this.fetchProjects(); // Fetch projects after successful authentication
              // Navigation is handled by the template showing the import details form
            } else {
              this.importStatus = null;
              this.importError =
                response.message || 'Azure DevOps authentication failed.';
            }
          },
          (error) => {
            this.loadingService.hide(); // Hide loading indicator
            console.error('Error handling Azure DevOps callback:', error);
            this.importStatus = null;
            this.importError =
              error.error?.message || 'Failed to handle Azure DevOps callback.';
            // TODO: Display more specific error message to the user
          }
        );
    } else {
      this.loadingService.hide(); // Hide loading indicator
      this.importStatus = null;
      this.importError =
        'Authorization code not found in Azure DevOps callback.';
    }
  }

  handleTrelloCallback(): void {
    this.loadingService.show(); // Show loading indicator
    this.importStatus = 'Handling Trello callback...';
    this.importError = null;

    // Trello returns the token in the URL fragment
    const fragment = window.location.hash.substring(1); // Remove the '#'
    const params = new URLSearchParams(fragment);
    const token = params.get('token');

    if (token) {
      const httpParams = new HttpParams().set('token', token); // Use HttpParams
      // Send the token to the backend callback endpoint
      this.http
        .get<{ success: boolean; message?: string; tokenId?: string }>(
          `${this.backendUrl}/import/trello/callback`,
          { params: httpParams }
        )
        .subscribe(
          // Pass token as HttpParams
          (response) => {
            this.loadingService.hide(); // Hide loading indicator
            if (response.success && response.tokenId) {
              this.importStatus =
                'Trello authentication successful. Token obtained.';
              this.tokenId = response.tokenId;
              this.selectedSource = 'trello'; // Set source after callback
              localStorage.setItem('importTokenId', this.tokenId); // Store tokenId in localStorage
              localStorage.setItem('importSource', this.selectedSource); // Store source in localStorage
              this.fetchProjects(); // Fetch projects after successful authentication
              // Navigation is handled by the template showing the import details form
            } else {
              this.importStatus = null;
              this.importError =
                response.message || 'Trello authentication failed.';
            }
          },
          (error) => {
            this.loadingService.hide(); // Hide loading indicator
            console.error('Error handling Trello callback:', error);
            this.importStatus = null;
            this.importError =
              error.error?.message || 'Failed to handle Trello callback.';
            // TODO: Display more specific error message to the user
          }
        );
    } else {
      this.loadingService.hide(); // Hide loading indicator
      this.importStatus = null;
      this.importError = 'Access token not found in Trello callback.';
    }
  }

  performImport(): void {
    if (!this.tokenId || !this.selectedSource || !this.selectedProject) {
      // Use selectedProject
      this.importError = 'Missing required information for import.';
      return;
    }

    this.loadingService.show(); // Show loading indicator
    this.importStatus = `Starting import from ${this.selectedSource}...`;
    this.importError = null;

    let importPayload: any = {
      tokenId: this.tokenId,
      projectId: this.selectedProject.id, // Use selected project ID
    };

    if (this.selectedSource === 'azure-devops') {
      if (!this.azureDevOpsOrganizationUrl || !this.azureDevOpsProjectId) {
        this.importError =
          'Missing Azure DevOps organization URL or project ID.';
        this.importStatus = null;
        this.loadingService.hide(); // Hide loading indicator
        return;
      }
      importPayload = {
        ...importPayload,
        organizationUrl: this.azureDevOpsOrganizationUrl,
        azureDevOpsProjectId: this.azureDevOpsProjectId,
      };
    } else if (this.selectedSource === 'trello') {
      if (!this.trelloBoardId) {
        this.importError = 'Missing Trello board ID.';
        this.importStatus = null;
        this.loadingService.hide(); // Hide loading indicator
        return;
      }
      importPayload = {
        ...importPayload,
        boardId: this.trelloBoardId,
      };
    } else {
      this.importError = 'Invalid import source selected.';
      this.importStatus = null;
      this.loadingService.hide(); // Hide loading indicator
      return;
    }

    this.http
      .post<ImportSuccessResponse>(
        `${this.backendUrl}/import/${this.selectedSource}`,
        importPayload
      )
      .subscribe(
        (response) => {
          this.loadingService.hide(); // Hide loading indicator
          console.log('Import successful:', response);
          this.importStatus =
            response.message || 'Import completed successfully.';
          // Navigate to the project details page after successful import
          if (response.projectId) {
            this.router.navigate(['/projects', response.projectId]);
          } else {
            // If projectId is not returned, navigate to a default page or show a success message
            // For now, just show success message
          }
        },
        (error) => {
          this.loadingService.hide(); // Hide loading indicator
          console.error('Import failed:', error);
          this.importStatus = null;
          this.importError =
            error.error?.message || 'Import failed. See console for details.';
          // TODO: Display specific error message to the user
        }
      );
  }

  resetImport(): void {
    this.selectedSource = null;
    this.importStatus = null;
    this.importError = null;
    this.tokenId = null;
    this.azureDevOpsOrganizationUrl = '';
    this.azureDevOpsProjectId = '';
    this.trelloBoardId = ''; // Corrected typo
    this.projects = []; // Reset projects list
    this.selectedProject = null; // Reset selected project
    localStorage.removeItem('importTokenId'); // Clear tokenId from localStorage
    localStorage.removeItem('importSource'); // Clear source from localStorage
    localStorage.removeItem('azureDevOpsOAuthState'); // Clear Azure DevOps state
    this.router.navigate(['/import']); // Navigate back to the initial import route
  }
}
