Name: Barot Pranav 
Student ID: 16373096
Assignment 2


# Screenshots
<img width="1382" height="860" alt="image" src="https://github.com/user-attachments/assets/3dbe7045-1d52-4b37-a4e8-a235a29b7b25" />
<img width="1543" height="368" alt="image" src="https://github.com/user-attachments/assets/b1a8b367-4eed-486d-bc70-a5970c16d672" />
<img width="1489" height="736" alt="image" src="https://github.com/user-attachments/assets/b2c0d4cb-ee7e-4887-ae12-d28f46ac1837" />
<img width="1540" height="673" alt="image" src="https://github.com/user-attachments/assets/f71572e9-7e98-42e4-8bd0-f531403973b1" />
<img width="1570" height="625" alt="image" src="https://github.com/user-attachments/assets/145ceae4-2f43-45db-b55d-3d10ea5d5f56" />
<img width="1591" height="651" alt="image" src="https://github.com/user-attachments/assets/9b24bf6e-1c32-4eca-a0aa-f29f74d5862c" />


# Part C:
Which landed first?
Tx1 landed first in block 2, while Tx2 landed in block 3.
So, Tx1 was mined before Tx2.

Which had higher effective gas price and priority tip?
Tx1 has max 1 Gwei   and effenctive is 1.7725 gwei
Tx2 has max 1 Gwei and effective is 1.6763 gwei
Tx1 had a slightly higher effective gas price than Tx2.
Both had the same priority tip (1 Gwei), but the effective gas price depends also on the base fee at the time of inclusion:

Tx1’s base fee: 0.7725 Gwei

Tx2’s base fee: 0.6763 Gwei

Brief EIP-1559 explanation (base fee + tip)
Base fee: Minimum gas fee per unit required by the network for the block. It is burned and adjusts per block depending on congestion.
Priority tip (maxPriorityFeePerGas): Extra incentive for miners/validators to include your transaction faster.
Effective gas price = base fee + priority tip.
Total fee paid = gas used × effective gas price.

# Part D
Example using Tx1 Transfer event:
Raw value (wei equivalent of tokens): 100000000000000000000
Human-readable value = valueRaw / 1e18 = 100 CAMP
Explanation:
ERC-20 tokens use decimals (18 by default).
Converting raw on-chain number to human-readable format = divide by 10^decimals.

