import Text "mo:base/Text";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";


actor JobPortal {
    // Stores candidate applications: candidate name -> list of companies
    stable var candidateApplications : [(Text, [Text])] = [];

    // Stores shortlists: company name -> list of shortlisted candidate names
    stable var shortLists : [(Text, [Text])] = [];

    // Registered companies with a company name -> unique company ID
    stable var companyArray : [(Text, Nat)] = [];

    // Global map to track which company has shortlisted which candidate
    stable var globalShortlist : [(Text, Text)] = [];

    let candidateMap = Map.fromIter<Text, [Text]>(
        candidateApplications.vals(), 10, Text.equal, Text.hash
    );

    let companyMap = Map.fromIter<Text, Nat>(
        companyArray.vals(), 10, Text.equal, Text.hash
    );

    let shortListMap = Map.fromIter<Text, [Text]>(
        shortLists.vals(), 10, Text.equal, Text.hash
    );

    let globalShortlistMap = Map.fromIter<Text, Text>(
        globalShortlist.vals(), 10, Text.equal, Text.hash
    );

    // Register a company on the portal
 



public func registerCompany(companyName: Text) {
    // Normalize the company name by trimming and converting to lowercase
    let normalizedName = Text.toLowercase(Text.trimEnd(companyName, #char ' '));

    switch (companyMap.get(normalizedName)) {
        case null {
            let newId = companyMap.size(); // Get the current size as new ID
            companyMap.put(normalizedName, newId);
            
            // Append the new entry to the companyArray
            companyArray := Array.append(companyArray, [(normalizedName, newId)]);
            Debug.print(debug_show(normalizedName));
        };
        case (?id) {
            // Company is already registered
            Debug.print("Company is already registered: " # normalizedName);
        };
    }
};


    //Get the names of the all the compnay
 public func getRegisteredCompanies(): async [(Text, Nat)] {
    return companyArray;
};
//Get the names of student Registered 
public func getStudentName(): async [(Text, [Text])] {
    let candidates = Iter.toArray(candidateMap.entries());  // Convert entries to an array

    // Iterate over the array of candidates and print the key-value pairs
    for (entry in candidates.vals()) {
        let (candidate, companies) = entry;  // Destructure the tuple
        Debug.print("Candidate: " # candidate # " Applied Companies: " # debug_show(companies));
    };

    return candidates;  // Return the array of candidates and their applied companies
};





    // Candidate applies for a job at a company
   public func applyForJob(candidateName: Text, companyName: Text): async Text {
    Debug.print("Applying for job: " # candidateName # " at " # companyName); // Debug log

    switch (globalShortlistMap.get(candidateName)) {
        case null {
            switch (companyMap.get(companyName)) {
                case null {
                    "Company " # companyName # " is not registered!";
                };
                case (?companyId) {
                    switch (candidateMap.get(candidateName)) {
                        case null {
                            candidateMap.put(candidateName, [companyName]);
                            "Candidate " # candidateName # " applied to " # companyName # ".";
                        };
                        case (?appliedCompanies) {
                            let alreadyApplied = Array.find<Text>(appliedCompanies, func(company) {
                                company == companyName
                            });

                            if (alreadyApplied != null) {
                                "Candidate " # candidateName # " has already applied to " # companyName # ".";
                            } else {
                                candidateMap.put(candidateName, Array.append(appliedCompanies, [companyName]));
                                "Candidate " # candidateName # " applied to " # companyName # ".";
                            }
                        };
                    }
                };
            }
        };
        case (?shortlistedCompany) {
            "Candidate " # candidateName # " has already been shortlisted by " # shortlistedCompany # " and cannot apply to other companies.";
        };
    }
};




    // Company shortlists a candidate (only one company can shortlist a candidate)
    public func shortlistCandidate(companyName: Text, candidateName: Text): async Text {
        switch (companyMap.get(companyName)) {
            case null {
                "Company " # companyName # " is not registered!";
            };
            case (?companyId) {
                // Check if the candidate applied to this company
                switch (candidateMap.get(candidateName)) {
                    case null {
                        "Candidate " # candidateName # " has not applied to any company!";
                    };
                    case (?appliedCompanies) {
                        let appliedToThisCompany = Array.find<Text>(appliedCompanies, func(company) {
                            company == companyName
                        });

                        if (appliedToThisCompany != null) {
                            // Check if the candidate is already shortlisted by another company
                            switch (globalShortlistMap.get(candidateName)) {
                                case null {
                                    // Shortlist the candidate for this company
                                    globalShortlistMap.put(candidateName, companyName);
                                    
                                    switch (shortListMap.get(companyName)) {
                                        case null {
                                            shortListMap.put(companyName, [candidateName]);
                                            "Candidate " # candidateName # " shortlisted by " # companyName # ".";
                                        };
                                        case (?shortList) {
                                            shortListMap.put(companyName, Array.append(shortList, [candidateName]));
                                            "Candidate " # candidateName # " shortlisted by " # companyName # ".";
                                        };
                                    }
                                };
                                case (?otherCompany) {
                                    "Candidate " # candidateName # " has already been shortlisted by " # otherCompany # " and cannot be shortlisted by " # companyName # ".";
                                };
                            }
                        } else {
                            "Candidate " # candidateName # " did not apply to " # companyName # ".";
                        }
                    };
                }
            };
        }
    };

    // Publish the shortlist results for all companies
  public func publishShortlistResults(): async Text {
    var result: Text = "Shortlist Results:\n";

    for ((companyName, shortList) in shortListMap.entries()) {
        result #= "Company: " # companyName # " Shortlisted Candidates:\n";
        for (candidateName in shortList.vals()) {
            result #= "- " # candidateName # "\n";
        }
    };

    if (result == "Shortlist Results:\n") {
        result #= "No shortlists available.";
    };

    return result;
};

public func updateShortlist(candidateName: Text, companyName: Text): async () {
    globalShortlistMap.put(candidateName, companyName); // Store candidate with associated company
};


public func getShortlistedCandidates(): async [(Text ,Text)] {
    let globalshortlist=Iter.toArray(globalShortlistMap.entries());
    return globalshortlist; // Returns an array of shortlisted candidate names
   
};


    // Pre-upgrade: Save current state
  system func preupgrade() {
    candidateApplications := Iter.toArray(candidateMap.entries());
    shortLists := Iter.toArray(shortListMap.entries());
    companyArray := Iter.toArray(companyMap.entries());
    globalShortlist := Iter.toArray(globalShortlistMap.entries());
};

system func postupgrade() {
    let candidateIter = Iter.fromArray(candidateApplications);
    let companyIter = Iter.fromArray(companyArray);
    let shortListIter = Iter.fromArray(shortLists);
    let globalShortlistIter = Iter.fromArray(globalShortlist);

    // Rebuild candidateMap
    for ((key, value) in candidateIter) {
        candidateMap.put(key, value);
    };

    // Rebuild companyMap
    for ((key, value) in companyIter) {
        companyMap.put(key, value);
    };

    // Rebuild shortListMap
    for ((key, value) in shortListIter) {
        shortListMap.put(key, value);
    };

    // Rebuild globalShortlistMap
    for ((key, value) in globalShortlistIter) {
        globalShortlistMap.put(key, value);
    };
};
}