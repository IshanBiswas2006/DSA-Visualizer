#include<iostream>
using namespace std;
int Linear_Search(int arr[],int count,int Key)
{
    for (int i = 0; i < count; i++)
    {
        if (arr[i]==Key)
        {
            return i;
        }      
    }
    return -1;
}

void Input(int arr[],int count)
{
    cout<<"Enter Elements: "<<endl;
    for (int i = 0; i < count; i++)
    {
        cin>>arr[i];
    }
    
}

void Output(int result)
{

    if (result != -1)
    {
        cout<<"The element found in index: "<<result;
    }
    else
    {
        cout<<"The element not found"<<endl;
    }
}

int main() {

    int arr[100];
    int n,key;

    cout<<"Enter Size of array: ";
    cin>>n;

    Input(arr,n);
    
    cout<<"Enter Key to found: ";
    cin>>key;

    int result=Linear_Search(arr,n,key);
    Output(result);

    return 0;
}