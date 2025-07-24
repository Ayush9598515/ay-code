#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    int n, target;
    cin >> n;
    int nums[n];
    
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    cin >> target;

    unordered_map<int, int> mp; // value -> index
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        if (mp.count(complement)) {
            cout << "[" << mp[complement] << "," << i << "]" << endl;
            return 0;
        }
        mp[nums[i]] = i;
    }

    cout << "No valid pair found." << endl;
    return 0;
}




