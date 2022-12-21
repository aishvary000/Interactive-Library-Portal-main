// C++ program to find the sum of
// the minimum of all the segments
#include <bits/stdc++.h>
using namespace std;
//const int MAX = 10;

// Function to maximize the sum of the minimums
int maximizeSum(int a[], int currentLen,int n, int ind,
				int k, vector<vector<int>>&dp,int maxTill)
{

	if(ind>=n)
    return maxTill;
    if(currentLen<k)
    {
        //take,or new
        int maxi=a[ind];
        // for(int i=ind;i<n;++i)
        // {
        //     maxi = max(maxi,a[i]);
        //     int continuee = maximizeSum(a,currentLen+1,n,ind+1,k,dp,maxi);
        //     int newSegment = maxTill+maximizeSum(a,1,n,ind+1,k,dp,a[i]);

        // }
        int include = maximizeSum(a,currentLen+1,n,ind+1,k,dp,max(maxTill,a[ind]));
        int newSegment = maxTill+maximizeSum(a,1,n,ind+1,k,dp,a[ind]);
        return min(newSegment,include);
    }
    if(currentLen==k)
    {
        
            return maxTill+maximizeSum(a,1,n,ind+1,k,dp,a[ind]);
       

    }
    return 0;
}

// Driver Code
int main()
{
	//int size = arr.size();
    int a[]={1,5,5,1};
    int k=2;
    vector<vector<int>>dp(4,vector<int>(3,-1));
	// Initialize dp array with -1
	// int dp[MAX][MAX];
	// memset(dp, -1, sizeof dp);
    int ans = maximizeSum(a,0, 4, 0, k, dp,0);
	//cout << maximizeSum(a, n, 0, k, dp);

    cout<<ans<<"\n";
	return 0;
}
